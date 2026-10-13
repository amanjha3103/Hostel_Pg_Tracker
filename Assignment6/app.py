from collections import defaultdict
from time import time as current_time
import json, os, random, time
import hashlib
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen
from flask import Flask, jsonify, request, url_for
from models import Listing
from store import store
from errors import problem
import gzip
from io import BytesIO


app = Flask(__name__)

@app.before_request
def apply_method_override():
    if request.method == "POST":
        override = request.headers.get(
            "X-HTTP-Method-Override", ""
        ).upper()

        if override in {"PATCH", "DELETE"}:
            request.environ["REQUEST_METHOD"] = override

@app.after_request
def add_common_headers(response):
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Strict-Transport-Security"] = (
        "max-age=31536000; includeSubDomains"
    )

    if "Access-Control-Allow-Origin" not in response.headers:
        response.headers["Access-Control-Allow-Origin"] = "*"
        client_ip = request.remote_addr or "unknown"
    now = current_time()
    cutoff = now - RATE_WINDOW_SECONDS

    recent = [
        timestamp
        for timestamp in rate_limit_store.get(client_ip, [])
        if timestamp > cutoff
    ]

    response.headers["X-RateLimit-Limit"] = str(RATE_LIMIT)
    response.headers["X-RateLimit-Remaining"] = str(
        max(0, RATE_LIMIT - len(recent))
    )

    return response


@app.after_request
def compress_json_response(response):
    # Compress only large JSON responses when the client supports gzip.
    accepts_gzip = "gzip" in request.headers.get("Accept-Encoding", "").lower()
    is_json = response.mimetype in (
        "application/json",
        "application/problem+json",
    )

    if (
        accepts_gzip
        and is_json
        and response.status_code not in (204, 304)
        and not response.headers.get("Content-Encoding")
        and response.content_length is not None
        and response.content_length >= 1024
    ):
        original = response.get_data()
        compressed = gzip.compress(original)

        if len(compressed) < len(original):
            response.set_data(compressed)
            response.headers["Content-Encoding"] = "gzip"
            response.headers["Content-Length"] = str(len(compressed))
            response.headers.add("Vary", "Accept-Encoding")

    return response


app.config["MAX_CONTENT_LENGTH"] = 100 * 1024

RATE_LIMIT = 10
RATE_WINDOW_SECONDS = 60
USER_SERVICE_URL = os.environ.get("USER_SERVICE_URL", "http://localhost:5002").rstrip("/")
TIMEOUT = float(os.environ.get("OUTBOUND_TIMEOUT_SECONDS", "1.5"))
MAX_ATTEMPTS = int(os.environ.get("OUTBOUND_MAX_ATTEMPTS", "3"))


rate_limit_store = defaultdict(list)


@app.before_request
def enforce_rate_limit():
    # Keep OPTIONS preflight requests from consuming the rate limit.
    if request.method == "OPTIONS":
        return None

    client_ip = request.remote_addr or "unknown"
    now = current_time()
    cutoff = now - RATE_WINDOW_SECONDS

    recent = [
        timestamp
        for timestamp in rate_limit_store[client_ip]
        if timestamp > cutoff
    ]

    if len(recent) >= RATE_LIMIT:
        response = problem(
            429,
            "Too Many Requests",
            "Rate limit exceeded. Retry after the indicated delay."
        )
        response.headers["X-RateLimit-Limit"] = str(RATE_LIMIT)
        response.headers["X-RateLimit-Remaining"] = "0"
        response.headers["Retry-After"] = str(RATE_WINDOW_SECONDS)
        rate_limit_store[client_ip] = recent
        return response

    recent.append(now)
    rate_limit_store[client_ip] = recent
    return None


def listing_etag(listing):
    """Generate an ETag from the current public listing data."""
    body = json.dumps(
        listing.as_json(),
        sort_keys=True,
        separators=(",", ":")
    ).encode("utf-8")

    return hashlib.sha256(body).hexdigest()

def validate(required, optional=None):
    # Validate JSON and its fields before handlers access them.
    if not request.is_json:
        return None, "Content-Type must be application/json."
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return None, "Body must be a JSON object."
    optional = optional or {}
    allowed = set(required) | set(optional)
    extra = set(data) - allowed
    if extra:
        return None, f"Unsupported fields: {', '.join(sorted(extra))}."
    for name, (kind, minimum, maximum) in {**required, **optional}.items():
        if name not in data:
            if name in required:
                return None, f"Missing required field: {name}."
            continue
        value = data[name]
        if kind == "string" and (not isinstance(value, str) or len(value.strip()) < minimum or len(value) > maximum):
            return None, f"{name} must be a string of length {minimum}–{maximum}."
        if kind == "integer" and (isinstance(value, bool) or not isinstance(value, int) or value < minimum):
            return None, f"{name} must be an integer >= {minimum}."
        if kind == "string_list" and (not isinstance(value, list) or any(not isinstance(x, str) or not x.strip() for x in value)):
            return None, f"{name} must be a list of non-empty strings."
    return data, None


def require_bearer_token():
    """Check the Authorization header; this is not real authentication."""
    authorization = request.headers.get("Authorization", "")
    parts = authorization.split(None, 1)

    if len(parts) != 2 or parts[0].lower() != "bearer" or not parts[1].strip():
        return problem(
            401,
            "Unauthorized",
            "Provide a non-empty Authorization: Bearer <token> header."
        )

    return None



def require_json_accept():
    """Reject requests that explicitly exclude JSON responses."""
    accept_header = request.headers.get("Accept", "")

    # No Accept header means the client accepts any response format.
    if not accept_header.strip():
        return None

    if not request.accept_mimetypes.accept_json:
        return problem(
            406,
            "Not Acceptable",
            "This API only supports JSON responses."
        )

    return None




def owner_eligible(owner_id):
    # Real HTTP GET. Base URL is configured, not hard-coded; timeout + backoff/jitter.
    url = f"{USER_SERVICE_URL}/owners/{quote(owner_id, safe='')}"
    last_error = None
    for attempt in range(MAX_ATTEMPTS):
        req = Request(url, headers={"Accept": "application/json"}, method="GET")
        try:
            with urlopen(req, timeout=TIMEOUT) as resp:
                if resp.status != 200:
                    raise RuntimeError("Unexpected upstream status")
                if "application/json" not in resp.headers.get("Content-Type", ""):
                    raise ValueError("Upstream response is not JSON")
                raw = resp.read(20001)
                if len(raw) > 20000:
                    raise ValueError("Upstream response too large")
                data = json.loads(raw.decode("utf-8"))
                if not isinstance(data, dict) or not isinstance(data.get("eligible"), bool):
                    raise ValueError("Upstream response schema invalid")
                return data["eligible"]
        except HTTPError as exc:
            if 400 <= exc.code < 500:
                if exc.code in (403, 404):
                    return False
                raise ValueError("Owner service rejected request") from exc
            last_error = exc
        except (URLError, TimeoutError, json.JSONDecodeError, RuntimeError) as exc:
            last_error = exc
        except ValueError:
            raise
        if attempt < MAX_ATTEMPTS - 1:
            time.sleep(min(0.2 * (2 ** attempt), 1.5) + random.uniform(0, 0.15))
    raise ConnectionError("Owner service unavailable") from last_error


@app.get("/listings", provide_automatic_options=False)
def search_listings():  
    accept_error = require_json_accept()
    if accept_error:
        return accept_error  
    location = request.args.get("location", "").strip()
    if not location:
        return problem(400, "Invalid filter", "The location query parameter is required.")
    try:
        min_rent = int(request.args.get("minRent", "0"))
        max_rent = int(request.args.get("maxRent", "2147483647"))
        if min_rent < 0 or max_rent < min_rent: raise ValueError()
    except ValueError:
        return problem(400, "Invalid filter", "Rent filters must be non-negative integers and maxRent must be >= minRent.")
    items = [x.as_json() for x in store.listings.values()
             if x.status == "ACTIVE" and location.casefold() in x.location.casefold()
             and min_rent <= x.monthly_rent <= max_rent]
    return jsonify({"items": items}), 200


@app.post("/listings", provide_automatic_options=False)
def create_listing():
    auth_error = require_bearer_token()
    if auth_error:
        return auth_error

    key = request.headers.get("Idempotency-Key", "")
    if not 8 <= len(key) <= 100:
        return problem(
            400,
            "Invalid idempotency key",
            "Idempotency-Key must contain 8–100 characters."
        )
    data, message = validate(
        {"ownerId": ("string", 1, 100), "title": ("string", 3, 120),
         "location": ("string", 2, 200), "monthlyRent": ("integer", 0, 2**31-1)},
        {"description": ("string", 0, 2000), "amenities": ("string_list", 0, 100)})
    if message: return problem(400, "Malformed request", message)
    try:
        eligible = owner_eligible(data["ownerId"])
    except ValueError:
        return problem(502, "Invalid dependency response", "User Service returned an invalid response.")
    except ConnectionError:
        return problem(503, "Owner service unavailable", "Eligibility could not be checked; retry with the same Idempotency-Key.")
    if not eligible:
        return problem(422, "Owner not eligible", "This owner is not eligible to create PG listings.")
    listing, replayed, conflict = store.create_idempotent(key, data)
    if conflict:
        return problem(409, "Idempotency key conflict", "This key was already used with a different request body.")
    response = jsonify(listing.as_json())
    response.status_code = 201
    response.headers["Location"] = url_for("get_listing", listing_id=listing.id)
    if replayed: response.headers["Idempotency-Replayed"] = "true"
    return response

@app.get("/listings/<listing_id>", provide_automatic_options=False)
def get_listing(listing_id):
    accept_error = require_json_accept()
    if accept_error:
        return accept_error
    listing = store.listings.get(listing_id)

    if not listing:
        return problem(
            404,
            "Listing not found",
            "No listing exists with that ID."
        )

    etag = listing_etag(listing)

    if request.if_none_match.contains(etag):
        response = app.response_class(status=304)
        response.set_etag(etag)
        response.headers["Cache-Control"] = "private, no-cache"
        return response

    response = jsonify(listing.as_json())
    response.set_etag(etag)
    response.headers["Cache-Control"] = "private, no-cache"

    return response, 200

@app.patch("/listings/<listing_id>", provide_automatic_options=False)
def update_listing(listing_id):
    listing = store.listings.get(listing_id)

    if not listing:
        return problem(
            404,
            "Listing not found",
            "No listing exists with that ID."
        )

    if request.headers.get("X-Owner-Id", "") != listing.owner_id:
        return problem(
            403,
            "Forbidden",
            "Only the listing owner may update this listing."
        )

    if "If-Match" in request.headers:
        current_etag = listing_etag(listing)

        if not request.if_match.star_tag and not request.if_match.contains(current_etag):
            response = problem(
                412,
                "Precondition failed",
                "The listing has changed. Fetch its latest ETag and retry."
            )
            response.set_etag(current_etag)
            return response

    data, message = validate(
        {},
        {
            "title": ("string", 3, 120),
            "location": ("string", 2, 200),
            "monthlyRent": ("integer", 0, 2**31 - 1),
            "description": ("string", 0, 2000),
            "amenities": ("string_list", 0, 100)
        }
    )

    if message:
        return problem(400, "Malformed request", message)

    if not data:
        return problem(
            400,
            "Malformed request",
            "Provide at least one field to update."
        )

    if "title" in data:
        listing.title = data["title"].strip()

    if "location" in data:
        listing.location = data["location"].strip()

    if "monthlyRent" in data:
        listing.monthly_rent = data["monthlyRent"]

    if "description" in data:
        listing.description = data["description"]

    if "amenities" in data:
        listing.amenities = data["amenities"]

    response = jsonify(listing.as_json())
    response.set_etag(listing_etag(listing))
    response.headers["Cache-Control"] = "private, no-cache"

    return response, 200

@app.patch("/listings/<listing_id>/status")
def change_status(listing_id):
    listing = store.listings.get(listing_id)
    if not listing: return problem(404, "Listing not found", "No listing exists with that ID.")
    if request.headers.get("X-Owner-Id", "") != listing.owner_id:
        return problem(403, "Forbidden", "Only the listing owner may change status.")
    data, message = validate({"status": ("string", 1, 10)})
    if message: return problem(400, "Malformed request", message)
    if data["status"] not in ("ACTIVE", "INACTIVE"):
        return problem(400, "Invalid status", "status must be ACTIVE or INACTIVE.")
    if listing.status == data["status"]:
        return problem(409, "State conflict", "Listing already has the requested status.")
    listing.status = data["status"]
    return jsonify(listing.as_json()), 200

@app.errorhandler(413)
def too_large(_exc):
    return problem(400, "Malformed request", "Request body exceeds the 100 KB limit.")

@app.errorhandler(Exception)
def unexpected(_exc):
    app.logger.exception("Unhandled exception")
    return problem(500, "Internal server error", "An unexpected error occurred.")


@app.route(
    "/listings",
    methods=["OPTIONS"],
    provide_automatic_options=False
)
def options_listings():
    response = app.response_class(status=204)
    response.headers["Allow"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = (
        "Content-Type, Authorization, Idempotency-Key, "
        "If-None-Match, If-Match, X-HTTP-Method-Override"
    )
    response.headers["Access-Control-Max-Age"] = "600"
    return response


@app.route(
    "/listings/<listing_id>",
    methods=["OPTIONS"],
    provide_automatic_options=False
)
def options_single_listing(listing_id):
    response = app.response_class(status=204)
    response.headers["Allow"] = "GET, PATCH, OPTIONS"
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, PATCH, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = (
        "Content-Type, Authorization, If-None-Match, "
        "If-Match, X-Owner-Id, X-HTTP-Method-Override"
    )
    response.headers["Access-Control-Max-Age"] = "600"
    return response


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=int(os.environ.get("PORT", "5001")), debug=False)



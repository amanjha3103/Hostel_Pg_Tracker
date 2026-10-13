AUTH_HEADERS = {"Authorization": "Bearer test-token"}
def payload():
    return {"ownerId": "OWNER-1", "title": "Sunrise PG", "location": "Gandhinagar",
            "monthlyRent": 7500, "description": "Near campus", "amenities": ["Wi-Fi"]}

def test_create_201_and_location(client):
    r = client.post("/listings", json=payload(), headers={
        **AUTH_HEADERS,
        "Idempotency-Key": "create-key-001"
    })
    assert r.status_code == 201
    assert r.headers["Location"].startswith("/listings/")
    assert r.json["id"]

def test_idempotent_repeat_returns_original(client):
    h = {**AUTH_HEADERS,"Idempotency-Key": "create-key-002"}
    a = client.post("/listings", json=payload(), headers=h)
    b = client.post("/listings", json=payload(), headers=h)
    assert a.status_code == b.status_code == 201
    assert a.json["id"] == b.json["id"]
    assert b.headers["Idempotency-Replayed"] == "true"

def test_malformed_body_has_problem_shape(client):
    r = client.post("/listings", json={"ownerId": "OWNER-1"},
                    headers={
        **AUTH_HEADERS,
        "Idempotency-Key": "create-key-001"
    })
    assert r.status_code == 400
    assert set(r.json) == {"type", "title", "status", "detail"}

def test_unknown_id_returns_404(client):
    r = client.get("/listings/not-real")
    assert r.status_code == 404
    assert r.json["status"] == 404

def test_state_conflict_returns_409(client):
    created = client.post("/listings", json=payload(), headers={ **AUTH_HEADERS,"Idempotency-Key": "create-key-004"})
    r = client.patch(f"/listings/{created.json['id']}/status", json={"status": "ACTIVE"},
                     headers={"X-Owner-Id": "OWNER-1"})
    assert r.status_code == 409


def test_get_listing_returns_etag(client):
    created = client.post(
        "/listings",
        json=payload(),
        headers={ **AUTH_HEADERS,"Idempotency-Key": "etag-create-001"}
    )
    assert created.status_code == 201

    listing_id = created.json["id"]
    response = client.get(f"/listings/{listing_id}")

    assert response.status_code == 200
    assert "ETag" in response.headers
    assert response.headers["Cache-Control"] == "private, no-cache"


def test_matching_if_none_match_returns_304(client):
    created = client.post(
        "/listings",
        json=payload(),
        headers={ **AUTH_HEADERS,"Idempotency-Key": "etag-create-002"}
    )
    listing_id = created.json["id"]

    first = client.get(f"/listings/{listing_id}")
    etag = first.headers["ETag"]

    second = client.get(
        f"/listings/{listing_id}",
        headers={"If-None-Match": etag}
    )

    assert second.status_code == 304
    assert not second.data


def test_stale_if_match_returns_412(client):
    created = client.post(
        "/listings",
        json=payload(),
        headers={ **AUTH_HEADERS,"Idempotency-Key": "etag-create-003"}
    )
    listing_id = created.json["id"]

    response = client.patch(
        f"/listings/{listing_id}",
        json={"title": "Updated Sunrise PG"},
        headers={
             **AUTH_HEADERS,
            "X-Owner-Id": "OWNER-1",
            "If-Match": '"stale-etag"'
        }
    )

    assert response.status_code == 412
    assert response.json["status"] == 412


def test_create_without_authorization_returns_401(client):
    response = client.post(
        "/listings",
        json=payload(),
        headers={ "Idempotency-Key": "auth-test-001"}
    )
    assert response.status_code == 401
    assert response.json["status"] == 401


def test_unsupported_accept_returns_406(client):
    response = client.get(
        "/listings?location=Gandhinagar",
        headers={"Accept": "text/html"}
    )
    assert response.status_code == 406
    assert response.json["status"] == 406

def test_rate_limit_headers_are_present(client):
    response = client.get(
        "/listings?location=Gandhinagar",
        headers={"Accept": "application/json"}
    )
    assert "X-RateLimit-Limit" in response.headers
    assert "X-RateLimit-Remaining" in response.headers

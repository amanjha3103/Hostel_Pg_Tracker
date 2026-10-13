from hashlib import sha256
import json
from threading import RLock
from models import Listing

class Store:
    # Coursework demo store; use persistent listing_db storage in deployment.
    def __init__(self):
        self.listings = {}
        self.idempotency = {}
        self.lock = RLock()

    def create_idempotent(self, key, payload):
        fingerprint = sha256(json.dumps(payload, sort_keys=True, separators=(",", ":")).encode()).hexdigest()
        with self.lock:
            previous = self.idempotency.get(key)
            if previous:
                old_fingerprint, listing_id = previous
                if old_fingerprint != fingerprint:
                    return self.listings[listing_id], False, True
                return self.listings[listing_id], True, False
            listing = Listing(
                owner_id=payload["ownerId"], title=payload["title"].strip(),
                location=payload["location"].strip(), monthly_rent=payload["monthlyRent"],
                description=payload.get("description", ""), amenities=payload.get("amenities", [])
            )
            self.listings[listing.id] = listing
            self.idempotency[key] = (fingerprint, listing.id)
            return listing, False, False

store = Store()

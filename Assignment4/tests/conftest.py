import pytest
import app as listing_app
from store import store

@pytest.fixture()
def client(monkeypatch):
    store.listings.clear()
    store.idempotency.clear()
    monkeypatch.setattr(listing_app, "owner_eligible", lambda _owner_id: True)
    listing_app.app.config.update(TESTING=True)
    with listing_app.app.test_client() as client:
        yield client

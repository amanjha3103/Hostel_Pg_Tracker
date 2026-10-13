def payload():
    return {"ownerId": "OWNER-1", "title": "Sunrise PG", "location": "Gandhinagar",
            "monthlyRent": 7500, "description": "Near campus", "amenities": ["Wi-Fi"]}

def test_create_201_and_location(client):
    r = client.post("/listings", json=payload(), headers={"Idempotency-Key": "create-key-001"})
    assert r.status_code == 201
    assert r.headers["Location"].startswith("/listings/")
    assert r.json["id"]

def test_idempotent_repeat_returns_original(client):
    h = {"Idempotency-Key": "create-key-002"}
    a = client.post("/listings", json=payload(), headers=h)
    b = client.post("/listings", json=payload(), headers=h)
    assert a.status_code == b.status_code == 201
    assert a.json["id"] == b.json["id"]
    assert b.headers["Idempotency-Replayed"] == "true"

def test_malformed_body_has_problem_shape(client):
    r = client.post("/listings", json={"ownerId": "OWNER-1"},
                    headers={"Idempotency-Key": "create-key-003"})
    assert r.status_code == 400
    assert set(r.json) == {"type", "title", "status", "detail"}

def test_unknown_id_returns_404(client):
    r = client.get("/listings/not-real")
    assert r.status_code == 404
    assert r.json["status"] == 404

def test_state_conflict_returns_409(client):
    created = client.post("/listings", json=payload(), headers={"Idempotency-Key": "create-key-004"})
    r = client.patch(f"/listings/{created.json['id']}/status", json={"status": "ACTIVE"},
                     headers={"X-Owner-Id": "OWNER-1"})
    assert r.status_code == 409

# Hostel PG Tracker — Listing Service

Python Flask coursework implementation adapted from the uploaded Assignment 4 brief.

## Contents
`openapi.yaml`, `models.py`, `store.py`, `errors.py`, `app.py`, `tests/`, `NOTES.md`.

## Run
Python 3.10+ recommended:
```bash
python -m venv .venv
# Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
pytest -q
```
To run the API, configure a User Service implementing `GET /owners/<ownerId>` and returning `{"eligible":true}` or `{"eligible":false}`:
```powershell
$env:USER_SERVICE_URL = "http://127.0.0.1:5002"
python app.py
```
The Listing Service listens on `http://127.0.0.1:5001`.

## Endpoints
- `GET /listings?location=Gandhinagar&minRent=4000&maxRent=10000`
- `POST /listings` (requires `Idempotency-Key`)
- `GET /listings/{listingId}`
- `PATCH /listings/{listingId}` (demo owner check uses `X-Owner-Id`)
- `PATCH /listings/{listingId}/status` (demo owner check uses `X-Owner-Id`)

All errors use `application/problem+json` with `{type, title, status, detail}`. Storage is in-memory for coursework and resets on restart. Production should use persistent `listing_db`, atomic idempotency, and real token-based authentication.

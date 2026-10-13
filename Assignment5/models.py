from dataclasses import dataclass, field
from datetime import datetime, timezone
from uuid import uuid4

@dataclass
class Listing:
    owner_id: str
    title: str
    location: str
    monthly_rent: int
    description: str = ""
    amenities: list[str] = field(default_factory=list)
    status: str = "ACTIVE"
    id: str = field(default_factory=lambda: f"PG-{uuid4()}")
    created_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    def as_json(self):
        # Public representation omits internal storage/idempotency details.
        return {
            "id": self.id, "ownerId": self.owner_id, "title": self.title,
            "location": self.location, "monthlyRent": self.monthly_rent,
            "description": self.description, "amenities": list(self.amenities),
            "status": self.status, "createdAt": self.created_at
        }

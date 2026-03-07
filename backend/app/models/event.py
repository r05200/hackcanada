from datetime import datetime, timezone

class Event:
    @staticmethod
    def to_dict(doc):
        if not doc:
            return None
        return {
            "id": str(doc["_id"]),
            "title": doc.get("title"),
            "description": doc.get("description"),
            "location": doc.get("location"),
            "starts_at": doc.get("starts_at").isoformat() if doc.get("starts_at") else None,
            "xp_reward": doc.get("xp_reward", 100),
            "tags": doc.get("tags", []),
            "created_by": doc.get("created_by"),
        }

    @staticmethod
    def create(title, description, location, starts_at, created_by, xp_reward=100, tags=None):
        return {
            "title": title,
            "description": description,
            "location": location,
            "xp_reward": xp_reward,
            "is_active": True,
            "starts_at": starts_at,
            "tags": tags or [],
            "created_by": created_by,
            "created_at": datetime.now(timezone.utc),
        }

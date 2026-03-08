from datetime import datetime, timezone

class Event:
    @staticmethod
    def to_dict(doc):
        if not doc:
            return None
        starts_at = doc.get("starts_at")
        if isinstance(starts_at, datetime):
            starts_at_str = starts_at.isoformat()
        elif isinstance(starts_at, str):
            starts_at_str = starts_at
        else:
            starts_at_str = None
        return {
            "id": str(doc["_id"]),
            "title": doc.get("title"),
            "description": doc.get("description"),
            "location": doc.get("location"),
            "starts_at": starts_at_str,
            "xp_reward": doc.get("xp_reward", 100),
            "tags": doc.get("tags", []),
            "created_by": doc.get("created_by"),
        }

    @staticmethod
    def create(title, description, location, starts_at, created_by, xp_reward=100, tags=None):
        # Convert ISO string from frontend to a proper datetime object
        if isinstance(starts_at, str) and starts_at:
            try:
                starts_at = datetime.fromisoformat(starts_at.replace("Z", "+00:00"))
            except ValueError:
                pass  # leave as string if parsing fails
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

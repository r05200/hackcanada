from datetime import datetime
from bson.objectid import ObjectId

class Challenge:
    """
    Challenge document schema for MongoDB.

    Example MongoDB document:
    {
        "_id": ObjectId("..."),
        "title": "Vote in Local Election",
        "description": "Cast your vote in the upcoming municipal election",
        "category": "voting",  # voting, volunteering, reporting, etc.
        "xp_reward": 100,
        "badge_reward": "civic_voter",
        "is_active": True,
        "deadline": datetime(2026, 3, 15),
        "created_at": datetime.utcnow()
    }
    """

   
    @staticmethod
    def to_dict(doc):
        """Convert MongoDB document to dict for JSON response."""
        if not doc:
            return None

        return {
            "id": str(doc["_id"]),
            "title": doc.get("title"),
            "description": doc.get("description"),
            "category": doc.get("category"),
            "xp_reward": doc.get("xp_reward", 100),
            "badge_reward": doc.get("badge_reward"),
            "is_active": doc.get("is_active", True),
            "deadline": doc.get("deadline").isoformat() if doc.get("deadline") else None,
            "created_at": doc.get("created_at").isoformat() if doc.get("created_at") else None,
        }

    @staticmethod
    def create(title, description, category, tags, xp_reward=100, badge_reward=None, deadline=None):
        """Create a new challenge document."""
        return {
            "title": title,
            "description": description,
            "category": category,
            "xp_reward": xp_reward,
            "badge_reward": badge_reward,
            "is_active": True,
            "deadline": deadline,
            "tags": tags,
            "created_at": datetime.now.timezone.utc(),
        }

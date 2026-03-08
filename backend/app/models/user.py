from datetime import datetime, timezone
from app.utils import bcrypt

class User:
    @staticmethod
    def to_dict(doc):
        if not doc:
            return None
        return {
            "id": str(doc["_id"]),
            "username": doc.get("username"),
            "email": doc.get("email"),
            "xp": doc.get("xp", 0),
            "level": doc.get("level", 1),
            "badges": doc.get("badges", []),
            "neighborhood": doc.get("neighborhood"),
            "streak": doc.get("streak", 0),
            "events_attended": doc.get("events_attended", 0),
        }

    @staticmethod
    def create(username, email, password, neighborhood=None):
        return {
            "username": username,
            "email": email,
            "password_hash": bcrypt.generate_password_hash(password).decode('utf-8'),
            "xp": 0,
            "level": 1,
            "badges": [],
            "neighborhood": neighborhood,
            "streak": 0,
            "events_attended": 0,
            "created_at": datetime.now(timezone.utc),
        }

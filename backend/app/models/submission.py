from datetime import datetime, timezone

class Submission:
    @staticmethod
    def to_dict(doc):
        if not doc:
            return None
        return {
            "id": str(doc["_id"]),
            "user_id": doc.get("user_id"),
            "challenge_id": doc.get("challenge_id"),
            "proof_url": doc.get("proof_url"),
            "status": doc.get("status", "pending"),
            "ai_confidence": doc.get("ai_confidence"),
            "submitted_at": doc.get("submitted_at").isoformat() if doc.get("submitted_at") else None,
        }

    @staticmethod
    def create(user_id, challenge_id, proof_url=None):
        return {
            "user_id": user_id,
            "challenge_id": challenge_id,
            "proof_url": proof_url,
            "status": "pending",
            "ai_confidence": None,
            "submitted_at": datetime.now(timezone.utc),
            "reviewed_at": None,
        }

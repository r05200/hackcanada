from app import db
from datetime import datetime

class Submission(db.Model):
    __tablename__ = "submissions"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    challenge_id = db.Column(db.Integer, db.ForeignKey("challenges.id"), nullable=False)
    proof_url = db.Column(db.String(500))  # photo/doc proof uploaded by user
    status = db.Column(db.String(20), default="pending")  # pending | approved | rejected
    ai_confidence = db.Column(db.Float)  # score from AI verification model
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    reviewed_at = db.Column(db.DateTime)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "challenge_id": self.challenge_id,
            "proof_url": self.proof_url,
            "status": self.status,
            "ai_confidence": self.ai_confidence,
            "submitted_at": self.submitted_at.isoformat(),
        }

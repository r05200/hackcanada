from app import db
from datetime import datetime

class Challenge(db.Model):
    __tablename__ = "challenges"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(80))  # e.g. "voting", "volunteering", "reporting"
    xp_reward = db.Column(db.Integer, default=100)
    badge_reward = db.Column(db.String(80))
    is_active = db.Column(db.Boolean, default=True)
    deadline = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    submissions = db.relationship("Submission", backref="challenge", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "category": self.category,
            "xp_reward": self.xp_reward,
            "badge_reward": self.badge_reward,
            "is_active": self.is_active,
            "deadline": self.deadline.isoformat() if self.deadline else None,
        }

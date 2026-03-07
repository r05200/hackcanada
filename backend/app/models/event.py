from app import db
from datetime import datetime

class Event(db.Model):
    __tablename__ = "events"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    location = db.Column(db.String(200))
    neighborhood = db.Column(db.String(120))
    starts_at = db.Column(db.DateTime)
    xp_reward = db.Column(db.Integer, default=50)
    created_by = db.Column(db.Integer, db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "location": self.location,
            "neighborhood": self.neighborhood,
            "starts_at": self.starts_at.isoformat() if self.starts_at else None,
            "xp_reward": self.xp_reward,
            "created_by": self.created_by,
        }

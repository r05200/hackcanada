from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.event import Event

events_bp = Blueprint("events", __name__)

@events_bp.route("/", methods=["GET"])
def list_events():
    """List upcoming community events."""
    neighborhood = request.args.get("neighborhood")
    query = Event.query
    if neighborhood:
        query = query.filter_by(neighborhood=neighborhood)
    events = query.order_by(Event.starts_at).all()
    return jsonify([e.to_dict() for e in events]), 200

@events_bp.route("/<int:event_id>", methods=["GET"])
def get_event(event_id):
    """Get a single event."""
    event = Event.query.get_or_404(event_id)
    return jsonify(event.to_dict()), 200

@events_bp.route("/", methods=["POST"])
@jwt_required()
def create_event():
    """Create a new community event."""
    user_id = get_jwt_identity()
    data = request.get_json()
    event = Event(
        title=data["title"],
        description=data.get("description"),
        location=data.get("location"),
        neighborhood=data.get("neighborhood"),
        xp_reward=data.get("xp_reward", 50),
        created_by=user_id,
    )
    db.session.add(event)
    db.session.commit()
    return jsonify(event.to_dict()), 201

@events_bp.route("/<int:event_id>/checkin", methods=["POST"])
@jwt_required()
def checkin_event(event_id):
    """Check into a community event to earn XP."""
    user_id = get_jwt_identity()
    # TODO: verify location, award XP to user
    return jsonify({"message": "checked in", "event_id": event_id}), 200

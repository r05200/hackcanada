from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.event import Event
from bson import ObjectId

events_bp = Blueprint("events", __name__)

@events_bp.route("/", methods=["GET"])
def list_events():
    """List upcoming community events."""
    neighborhood = request.args.get("neighborhood")
    query = {}
    if neighborhood:
        query["neighborhood"] = neighborhood
    events = current_app.db.events.find(query).sort("starts_at", 1)
    return jsonify([Event.to_dict(e) for e in events]), 200

@events_bp.route("/<event_id>", methods=["GET"])
def get_event(event_id):
    """Get a single event."""
    try:
        oid = ObjectId(event_id)
    except Exception:
        return jsonify({"message": "invalid id"}), 400
    event = current_app.db.events.find_one({"_id": oid})
    if not event:
        return jsonify({"message": "not found"}), 404
    return jsonify(Event.to_dict(event)), 200

@events_bp.route("/", methods=["POST"])
@jwt_required()
def create_event():
    """Create a new community event."""
    user_id = get_jwt_identity()
    data = request.get_json()
    event = Event.create(
        title=data["title"],
        description=data.get("description"),
        location=data.get("location"),
        starts_at=data.get("starts_at"),
        created_by=user_id,
        xp_reward=data.get("xp_reward", 100),
        tags=data.get("tags", []),
    )
    result = current_app.db.events.insert_one(event)
    event["_id"] = result.inserted_id
    return jsonify(Event.to_dict(event)), 201

@events_bp.route("/<event_id>/checkin", methods=["POST"])
@jwt_required()
def checkin_event(event_id):
    """Check into a community event to earn XP."""
    user_id = get_jwt_identity()

    # Prevent duplicate check-ins
    already = current_app.db.checkins.find_one({"user_id": user_id, "event_id": event_id})
    if already:
        return jsonify({"message": "Already checked in to this event"}), 400

    # Get event for XP reward
    event = current_app.db.events.find_one({"_id": ObjectId(event_id)})
    if not event:
        return jsonify({"message": "Event not found"}), 404

    xp_reward = event.get("xp_reward", 100)

    # Record check-in
    current_app.db.checkins.insert_one({"user_id": user_id, "event_id": event_id})

    # Update user: increment XP, events_attended, streak; recalculate level
    user = current_app.db.users.find_one({"_id": ObjectId(user_id)})
    new_xp = user.get("xp", 0) + xp_reward
    new_level = new_xp // 500 + 1
    current_app.db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$inc": {"xp": xp_reward, "events_attended": 1, "streak": 1},
         "$set": {"level": new_level}},
    )

    return jsonify({"message": "Checked in!", "xp_earned": xp_reward}), 200

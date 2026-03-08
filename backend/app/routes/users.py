from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from bson import ObjectId

users_bp = Blueprint("users", __name__)

@users_bp.route("/me", methods=["GET"])
@jwt_required()
def get_profile():
    """Get the current user's profile."""
    user_id = get_jwt_identity()
    user = current_app.db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"message": "not found"}), 404
    profile = User.to_dict(user)
    profile["reports_count"] = user.get("reports_filed", 0)
    return jsonify(profile), 200

@users_bp.route("/<user_id>", methods=["GET"])
def get_user(user_id):
    """Get a user's public profile."""
    user = current_app.db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"message": "not found"}), 404
    return jsonify(User.to_dict(user)), 200

@users_bp.route("/me/award-xp", methods=["POST"])
@jwt_required()
def award_xp():
    """Award XP to the current user for completing a daily challenge."""
    user_id = get_jwt_identity()
    data = request.get_json()
    amount = int(data.get("xp", 0))
    if amount <= 0:
        return jsonify({"message": "invalid xp amount"}), 400
    user = current_app.db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"message": "not found"}), 404
    new_xp = user.get("xp", 0) + amount
    new_level = new_xp // 500 + 1
    current_app.db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"xp": new_xp, "level": new_level}},
    )
    return jsonify({"xp": new_xp, "level": new_level, "awarded": amount}), 200


@users_bp.route("/me/accept-challenge", methods=["POST"])
@jwt_required()
def accept_challenge():
    """Save an accepted daily challenge to the user's active_challenges list."""
    from datetime import datetime, timezone
    user_id = get_jwt_identity()
    data = request.get_json()
    challenge = {
        "_id": data.get("_id"),
        "title": data.get("title"),
        "subtitle": data.get("subtitle", ""),
        "icon": data.get("icon"),
        "iconBg": data.get("iconBg"),
        "iconColor": data.get("iconColor"),
        "points": data.get("points"),
        "accepted_at": datetime.now(timezone.utc).isoformat(),
    }
    # Avoid duplicates
    current_app.db.users.update_one(
        {"_id": ObjectId(user_id), "active_challenges._id": {"$ne": challenge["_id"]}},
        {"$push": {"active_challenges": challenge}},
    )
    return jsonify({"ok": True}), 200


@users_bp.route("/me/complete-challenge", methods=["POST"])
@jwt_required()
def complete_challenge():
    """Move a challenge from active to completed, and award XP."""
    from datetime import datetime, timezone
    user_id = get_jwt_identity()
    data = request.get_json()
    challenge_id = data.get("_id")
    xp = int(data.get("points", 0))

    user = current_app.db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"message": "not found"}), 404

    # Find the challenge in active list
    active = user.get("active_challenges", [])
    challenge = next((c for c in active if c.get("_id") == challenge_id), None)

    new_xp = user.get("xp", 0) + xp
    new_level = new_xp // 500 + 1

    completed_entry = {
        "_id": challenge_id,
        "title": challenge.get("title") if challenge else data.get("title", ""),
        "points": xp,
        "completed_at": datetime.now(timezone.utc).isoformat(),
    }

    current_app.db.users.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {"xp": new_xp, "level": new_level},
            "$pull": {"active_challenges": {"_id": challenge_id}},
            "$push": {"completed_challenges": completed_entry},
        },
    )
    return jsonify({"xp": new_xp, "level": new_level, "awarded": xp}), 200

@users_bp.route("/me/badges", methods=["GET"])
@jwt_required()
def get_badges():
    """Get the current user's earned badges."""
    user_id = get_jwt_identity()
    user = current_app.db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"message": "not found"}), 404
    return jsonify({"badges": user.get("badges", [])}), 200

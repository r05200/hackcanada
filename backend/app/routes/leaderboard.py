from flask import Blueprint, request, jsonify, current_app
from app.models.user import User

leaderboard_bp = Blueprint("leaderboard", __name__)

@leaderboard_bp.route("/", methods=["GET"])
def global_leaderboard():
    """Top users by XP globally."""
    limit = request.args.get("limit", 20, type=int)
    users = current_app.db.users.find().sort("xp", -1).limit(limit)
    return jsonify([User.to_dict(u) for u in users]), 200

@leaderboard_bp.route("/neighborhood/<string:neighborhood>", methods=["GET"])
def neighborhood_leaderboard(neighborhood):
    """Top users by XP within a neighborhood."""
    limit = request.args.get("limit", 20, type=int)
    users = current_app.db.users.find(
        {"neighborhood": neighborhood}
    ).sort("xp", -1).limit(limit)
    return jsonify([User.to_dict(u) for u in users]), 200

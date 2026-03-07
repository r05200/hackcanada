from flask import Blueprint, request, jsonify
from app.models.user import User

leaderboard_bp = Blueprint("leaderboard", __name__)

@leaderboard_bp.route("/", methods=["GET"])
def global_leaderboard():
    """Top users by XP globally."""
    limit = request.args.get("limit", 20, type=int)
    users = User.query.order_by(User.xp.desc()).limit(limit).all()
    return jsonify([u.to_dict() for u in users]), 200

@leaderboard_bp.route("/neighborhood/<string:neighborhood>", methods=["GET"])
def neighborhood_leaderboard(neighborhood):
    """Top users by XP within a neighborhood."""
    limit = request.args.get("limit", 20, type=int)
    users = (
        User.query
        .filter_by(neighborhood=neighborhood)
        .order_by(User.xp.desc())
        .limit(limit)
        .all()
    )
    return jsonify([u.to_dict() for u in users]), 200

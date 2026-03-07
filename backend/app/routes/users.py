from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User

users_bp = Blueprint("users", __name__)

@users_bp.route("/me", methods=["GET"])
@jwt_required()
def get_profile():
    """Get the current user's profile."""
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict()), 200

@users_bp.route("/<int:user_id>", methods=["GET"])
def get_user(user_id):
    """Get a user's public profile."""
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict()), 200

@users_bp.route("/me/badges", methods=["GET"])
@jwt_required()
def get_badges():
    """Get the current user's earned badges."""
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    return jsonify({"badges": user.badges}), 200

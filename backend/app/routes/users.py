from flask import Blueprint, jsonify, current_app
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
    return jsonify(User.to_dict(user)), 200

@users_bp.route("/<user_id>", methods=["GET"])
def get_user(user_id):
    """Get a user's public profile."""
    user = current_app.db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"message": "not found"}), 404
    return jsonify(User.to_dict(user)), 200

@users_bp.route("/me/badges", methods=["GET"])
@jwt_required()
def get_badges():
    """Get the current user's earned badges."""
    user_id = get_jwt_identity()
    user = current_app.db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"message": "not found"}), 404
    return jsonify({"badges": user.get("badges", [])}), 200

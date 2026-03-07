from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app import db
from app.models.user import User

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user."""
    data = request.get_json()
    # TODO: hash password, validate fields
    return jsonify({"message": "registered"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    """Login and return a JWT token."""
    data = request.get_json()
    # TODO: verify credentials, return JWT
    token = create_access_token(identity=1)  # placeholder user id
    return jsonify({"access_token": token}), 200

@auth_bp.route("/logout", methods=["POST"])
def logout():
    """Logout (client-side token discard)."""
    return jsonify({"message": "logged out"}), 200

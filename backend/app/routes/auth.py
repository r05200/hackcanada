from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token
from app.models.user import User
from app.utils import bcrypt

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user."""
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    neighborhood = data.get("neighborhood")
    existing_user = current_app.db.users.find_one({"username": username})

    if not username or not email or not password or existing_user or existing_user["email"] == email:
        return jsonify({"message": "username, email, and password are required and username and email must be unique"}), 400
    hashed_pw = bcrypt.generate_password_hash(password).decode("utf-8")
    user = User.create(username, email, hashed_pw, neighborhood)
    current_app.db.users.insert_one(user)
    return jsonify({"message": "registered"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    """Login and return a JWT token."""
    data = request.get_json()
    email = data.get("email")
    password=data.get("password")
    user = current_app.db.users.find_one({"email": email})
    if not user or not bcrypt.check_password_hash(user["password_hash"], password):
        return jsonify({"message": "invalid credentials"}), 401
    token = create_access_token(identity=user["_id"])
    return jsonify({"access_token": token, "user": User.to_dict(user)}), 200

@auth_bp.route("/logout", methods=["POST"])
def logout():
    
    return jsonify({"message": "logged out"}), 200

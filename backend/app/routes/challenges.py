from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.challenge import Challenge
from app.models.submission import Submission
from bson import ObjectId

challenges_bp = Blueprint("challenges", __name__)

@challenges_bp.route("/", methods=["GET"])
def list_challenges():
    """List all active challenges."""
    challenges = current_app.db.challenges.find({"is_active": True})
    return jsonify([Challenge.to_dict(c) for c in challenges]), 200

@challenges_bp.route("/<challenge_id>", methods=["GET"])
def get_challenge(challenge_id):
    """Get a single challenge."""
    challenge = current_app.db.challenges.find_one({"_id": ObjectId(challenge_id)})
    if not challenge:
        return jsonify({"message": "not found"}), 404
    return jsonify(Challenge.to_dict(challenge)), 200

@challenges_bp.route("/<challenge_id>/submit", methods=["POST"])
@jwt_required()
def submit_challenge(challenge_id):
    """Submit proof of completing a challenge."""
    user_id = get_jwt_identity()
    data = request.get_json()
    # TODO: handle proof upload, call AI verification
    submission = Submission.create(
        user_id=user_id,
        challenge_id=challenge_id,
        proof_url=data.get("proof_url"),
    )
    result = current_app.db.submissions.insert_one(submission)
    submission["_id"] = result.inserted_id
    return jsonify(Submission.to_dict(submission)), 201

@challenges_bp.route("/", methods=["POST"])
@jwt_required()
def create_challenge():
    """Create a new challenge (admin use)."""
    data = request.get_json()
    # TODO: restrict to admin role
    challenge = Challenge.create(
        title=data["title"],
        description=data.get("description"),
        category=data.get("category"),
        tags=data.get("tags", []),
        xp_reward=data.get("xp_reward", 100),
    )
    result = current_app.db.challenges.insert_one(challenge)
    challenge["_id"] = result.inserted_id
    return jsonify(Challenge.to_dict(challenge)), 201

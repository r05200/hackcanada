from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.challenge import Challenge
from app.models.submission import Submission

challenges_bp = Blueprint("challenges", __name__)

@challenges_bp.route("/", methods=["GET"])
def list_challenges():
    """List all active challenges."""
    challenges = Challenge.query.filter_by(is_active=True).all()
    return jsonify([c.to_dict() for c in challenges]), 200

@challenges_bp.route("/<int:challenge_id>", methods=["GET"])
def get_challenge(challenge_id):
    """Get a single challenge."""
    challenge = Challenge.query.get_or_404(challenge_id)
    return jsonify(challenge.to_dict()), 200

@challenges_bp.route("/<int:challenge_id>/submit", methods=["POST"])
@jwt_required()
def submit_challenge(challenge_id):
    """Submit proof of completing a challenge."""
    user_id = get_jwt_identity()
    data = request.get_json()
    # TODO: handle proof upload, call AI verification
    submission = Submission(
        user_id=user_id,
        challenge_id=challenge_id,
        proof_url=data.get("proof_url"),
    )
    db.session.add(submission)
    db.session.commit()
    return jsonify(submission.to_dict()), 201

@challenges_bp.route("/", methods=["POST"])
@jwt_required()
def create_challenge():
    """Create a new challenge (admin use)."""
    data = request.get_json()
    # TODO: restrict to admin role
    challenge = Challenge(
        title=data["title"],
        description=data.get("description"),
        category=data.get("category"),
        xp_reward=data.get("xp_reward", 100),
    )
    db.session.add(challenge)
    db.session.commit()
    return jsonify(challenge.to_dict()), 201

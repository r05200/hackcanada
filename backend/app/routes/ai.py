from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.ai.model import CivicAIModel

ai_bp = Blueprint("ai", __name__)
model = CivicAIModel()

@ai_bp.route("/verify", methods=["POST"])
@jwt_required()
def verify_submission():
    """
    Run AI verification on a submission proof.
    Expects JSON: { "proof_url": str, "challenge_category": str }
    Returns a confidence score and verdict.
    """
    data = request.get_json()
    proof_url = data.get("proof_url")
    category = data.get("challenge_category")

    confidence = model.verify(proof_url=proof_url, category=category)
    verdict = "approved" if confidence >= 0.75 else "rejected"

    return jsonify({"confidence": confidence, "verdict": verdict}), 200

@ai_bp.route("/recommend", methods=["GET"])
@jwt_required()
def recommend_challenges():
    """
    Recommend challenges for the current user based on their history.
    """
    # TODO: pass user history to model
    recommendations = model.recommend(user_id=1)
    return jsonify({"recommendations": recommendations}), 200

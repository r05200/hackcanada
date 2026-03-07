from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.ai.model import CivicAIModel

ai_bp = Blueprint("ai", __name__)
model = CivicAIModel()

@ai_bp.route("/verify", methods=["POST"])
@jwt_required()
def verify_submission():
   pass

@ai_bp.route("/recommend", methods=["GET"])
@jwt_required()
def recommend_challenges():
    """
    Recommend challenges for the current user based on their history.
    """
    # TODO: pass user history to model
    recommendations = model.recommend(user_id=1)
    return jsonify({"recommendations": recommendations}), 200

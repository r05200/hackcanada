from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timezone
from bson import ObjectId

reports_bp = Blueprint("reports", __name__)


@reports_bp.route("/", methods=["POST"])
@jwt_required()
def create_report():
    """Submit a new civic report and award 50 XP to the user."""
    user_id = get_jwt_identity()
    data = request.get_json()

    report = {
        "user_id": user_id,
        "topic": data.get("topic", ""),
        "location": data.get("location", ""),
        "urgency": data.get("urgency", "medium"),
        "description": data.get("description", ""),
        "status": "pending",
        "created_at": datetime.now(timezone.utc),
    }

    result = current_app.db.reports.insert_one(report)
    report["_id"] = result.inserted_id

    # Award 50 XP and increment reports_filed counter
    current_app.db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$inc": {"xp": 50, "reports_filed": 1}},
    )

    return jsonify({
        "id": str(report["_id"]),
        "topic": report["topic"],
        "location": report["location"],
        "urgency": report["urgency"],
        "description": report["description"],
        "status": report["status"],
        "xp_earned": 50,
    }), 201

import os
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

ai_bp = Blueprint("ai", __name__)

UPLOAD_PATH = os.path.abspath(os.path.expanduser("~/Downloads/UPLOADED_IMAGE.jpg"))


@ai_bp.route("/analyze", methods=["POST"])
@jwt_required()
def analyze_image():
    """Accept an image upload, save it to ~/Downloads/UPLOADED_IMAGE.jpg,
    run the Roboflow classifier, and return the detected topic."""
    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400

    img_file = request.files["image"]
    if not img_file.filename:
        return jsonify({"error": "Empty filename"}), 400

    # Save to the path the AI model expects
    os.makedirs(os.path.dirname(UPLOAD_PATH), exist_ok=True)
    img_file.save(UPLOAD_PATH)

    try:
        from app.ai.model import classify_image
        topic = classify_image(UPLOAD_PATH)
    except Exception as e:
        return jsonify({"error": f"AI analysis failed: {str(e)}"}), 500

    return jsonify({"topic": topic or ""}), 200


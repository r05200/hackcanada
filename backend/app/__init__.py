from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from pymongo import MongoClient
from config import config
from app.utils import bcrypt

jwt = JWTManager()

def create_app(config_name="default"):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    mongo = MongoClient(app.config["MONGO_URI"])
    app.db = mongo.get_database()

    bcrypt.init_app(app)
    jwt.init_app(app)
    CORS(app)

    from app.routes.auth import auth_bp
    from app.routes.users import users_bp
    from app.routes.challenges import challenges_bp
    from app.routes.events import events_bp
    from app.routes.leaderboard import leaderboard_bp
    from app.routes.ai import ai_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(users_bp, url_prefix="/api/users")
    app.register_blueprint(challenges_bp, url_prefix="/api/challenges")
    app.register_blueprint(events_bp, url_prefix="/api/events")
    app.register_blueprint(leaderboard_bp, url_prefix="/api/leaderboard")
    app.register_blueprint(ai_bp, url_prefix="/api/ai")

    return app

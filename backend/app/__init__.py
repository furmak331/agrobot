from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config

# Initialize extensions
db = SQLAlchemy()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Register blueprints
    from app.routes.weather import weather_bp
    app.register_blueprint(weather_bp, url_prefix='/api/weather')
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app

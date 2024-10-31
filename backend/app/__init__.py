from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    CORS(app)
    db.init_app(app)
    
    # Register blueprints
    from app.routes.weather import weather_bp
    from app.routes.crops import crops_bp
    from app.routes.pests import pests_bp
    from app.routes.market_prices import prices_bp
    
    app.register_blueprint(weather_bp, url_prefix='/api/weather')
    app.register_blueprint(crops_bp, url_prefix='/api/crops')
    app.register_blueprint(pests_bp, url_prefix='/api/pests')
    app.register_blueprint(prices_bp, url_prefix='/api/prices')
    
    return app

from flask import Blueprint, jsonify, request
from app.services.weather_service import WeatherService
from app.utils.exceptions import WeatherAPIException

weather_bp = Blueprint('weather', __name__)
weather_service = WeatherService()

@weather_bp.route('/current/<srinagar>', methods=['GET'])
def get_weather(district):
    try:
        weather_data = weather_service.get_weather_by_district(district)
        return jsonify(weather_data)
    except WeatherAPIException as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

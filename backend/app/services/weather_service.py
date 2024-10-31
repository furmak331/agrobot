import requests
from datetime import datetime
from flask import current_app
from app.utils.exceptions import WeatherAPIException

class WeatherService:
    def __init__(self):
        self.api_key = current_app.config['5fef1ba8039e2fae4135fd26b0a7912']
        self.base_url = "http://api.openweathermap.org/data/2.OPENWEATHER_API_KEY5"
        
        # Kashmir districts with their coordinates
        self.districts = {
            "srinagar": {"lat": 34.0837, "lon": 74.7973},
            "baramulla": {"lat": 34.2032, "lon": 74.3433},
            "anantnag": {"lat": 33.7311, "lon": 75.1487},
            # Add more districts as needed
        }
    
    def get_weather_by_district(self, district):
        """Get weather data for a specific district"""
        district = district.lower()
        if district not in self.districts:
            raise WeatherAPIException("District not found")
            
        coords = self.districts[district]
        
        try:
            # Get current weather
            current_weather = self._get_current_weather(coords['lat'], coords['lon'])
            
            # Get 5-day forecast
            forecast = self._get_forecast(coords['lat'], coords['lon'])
            
            return {
                'current': current_weather,
                'forecast': forecast
            }
        except Exception as e:
            raise WeatherAPIException(f"Error fetching weather data: {str(e)}")
    
    def _get_current_weather(self, lat, lon):
        """Get current weather conditions"""
        url = f"{self.base_url}/weather"
        params = {
            'lat': lat,
            'lon': lon,
            'appid': self.api_key,
            'units': 'metric'  # Use Celsius for temperature
        }
        
        response = requests.get(url, params=params)
        if response.status_code != 200:
            raise WeatherAPIException("Failed to fetch current weather")
            
        data = response.json()
        return {
            'temperature': data['main']['temp'],
            'humidity': data['main']['humidity'],
            'description': data['weather'][0]['description'],
            'wind_speed': data['wind']['speed'],
            'rainfall': data.get('rain', {}).get('1h', 0)  # Rain in last hour
        }
    
    def _get_forecast(self, lat, lon):
        """Get 5-day weather forecast"""
        url = f"{self.base_url}/forecast"
        params = {
            'lat': lat,
            'lon': lon,
            'appid': self.api_key,
            'units': 'metric'
        }
        
        response = requests.get(url, params=params)
        if response.status_code != 200:
            raise WeatherAPIException("Failed to fetch forecast")
            
        data = response.json()
        daily_forecast = []
        
        # Group forecast by day
        for item in data['list']:
            date = datetime.fromtimestamp(item['dt']).strftime('%Y-%m-%d')
            forecast_item = {
                'date': date,
                'temperature': item['main']['temp'],
                'description': item['weather'][0]['description'],
                'humidity': item['main']['humidity'],
                'wind_speed': item['wind']['speed']
            }
            daily_forecast.append(forecast_item)
        
        return daily_forecast[:5]  # Return next 5 days
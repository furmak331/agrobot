from typing import Dict, List
import random

class ChatService:
    def __init__(self):
        self.conversation_history = []
        self.responses = {
            "greetings": [
                "Hello! How can I help you with your farming today?",
                "Hi there! What farming assistance do you need?",
                "Welcome to AgroBot! How may I assist you?"
            ],
            "crop_info": {
                "rice": "Rice is a major crop that requires lots of water and warm temperatures.",
                "wheat": "Wheat is a winter crop that needs moderate water and cool temperatures.",
                "maize": "Maize is a summer crop that needs good sunlight and regular watering."
            },
            "weather": [
                "For accurate weather information, I recommend checking your local weather service.",
                "Weather conditions are important for farming. Would you like to know more about weather-resistant crops?"
            ],
            "default": [
                "I'm here to help with farming questions. Could you please be more specific?",
                "I can assist with crop recommendations, pest detection, and farming practices. What would you like to know?",
                "Feel free to ask about specific crops, pests, or farming techniques."
            ]
        }

    def get_response(self, message: str) -> Dict:
        message = message.lower()
        
        # Add message to history
        self.conversation_history.append({"role": "user", "content": message})

        # Generate response based on keywords
        if any(word in message for word in ["hello", "hi", "hey"]):
            response = random.choice(self.responses["greetings"])
        elif "weather" in message:
            response = random.choice(self.responses["weather"])
        elif any(crop in message for crop in self.responses["crop_info"].keys()):
            for crop in self.responses["crop_info"].keys():
                if crop in message:
                    response = self.responses["crop_info"][crop]
                    break
        else:
            response = random.choice(self.responses["default"])

        # Add response to history
        self.conversation_history.append({"role": "assistant", "content": response})

        return {
            "response": response,
            "context": {
                "topic": "general",
                "confidence": 0.8
            }
        }

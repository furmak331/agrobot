
---

# **Agro Bot**

Agro Bot is an AI-driven advisory chatbot designed to assist farmers in the Kanyashmir region with real-time information on crop choices, weather updates, pest and disease management, and market prices. The bot aims to bridge the gap in accessible agricultural knowledge, providing guidance in several languages.

---

## **Features**

- **Weather Updates**: Provides accurate and localized weather forecasts to help farmers plan their activities.
- **Crop Recommendations**: Suggests suitable crops based on season, soil type, and weather conditions, using a rule-based and machine learning approach.
- **Pest and Disease Detection**: Identifies common pests and diseases from uploaded crop images and offers suggestions for treatment.
- **Market Price Tracking**: Displays real-time prices for crops in various regional markets.
- **Multilingual Support**: Supports English, Urdu, and Kashmiri, making it accessible to a wider user base.
- **Image Processing Pipeline**: Prepares images for analysis through resizing, normalization, and augmentation for improved pest and disease detection.

---


## **Setup and Installation**

### **Prerequisites**

- **Python 3.8+** and **Node.js 14+**
- API Key for [OpenWeather](https://openweathermap.org/api)
- (Optional) Translation API Key (e.g., Google Cloud Translation)

### **Backend Setup**

1. **Navigate to the Backend Directory**:
   ```bash
   cd AgroBot/backend
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables**:
   - Create a `.env` file in the `backend` directory with the following information:
     ```bash
     FLASK_APP=__init__.py
     WEATHER_API_KEY=<your_openweather_api_key>
     TRANSLATION_API_KEY=<your_translation_api_key> # optional
     ```

4. **Run the Backend Server**:
   ```bash
   flask run
   ```

### **Frontend Setup**

1. **Navigate to the Frontend Directory**:
   ```bash
   cd AgroBot/frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Frontend**:
   ```bash
   npm start
   ```

The frontend will start on [http://localhost:3000](http://localhost:3000), and the backend should be accessible at [http://localhost:5000](http://localhost:5000).

---

## **Usage**

### **Weather Updates**
- Enter your district or area to receive weather forecasts. The bot uses this information to help with crop and irrigation planning.

### **Crop Recommendations**
- Input parameters such as district, season, and soil type to receive crop suggestions suitable for local conditions.

### **Pest and Disease Detection**
- Upload images of affected crops, and the bot will detect common pests or diseases and recommend potential treatments.

### **Market Price Tracking**
- The bot can display the latest market prices for various crops to help farmers make informed decisions on selling or buying produce.

### **Multilingual Support**
- Choose between English, Urdu, and Kashmiri for interactions with Agro Bot, making it more accessible to local farmers.

---

## **Technology Stack**

- **Frontend**: React.js for the user interface
- **Backend**: Flask for the API and service layer
- **Database**: MongoDB/PostgreSQL for data storage (optional, based on your needs)
- **Machine Learning Models**: Convolutional Neural Networks (CNN) for pest detection and a rule-based or simple ML model for crop recommendations

---

## **Contributing**

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/new-feature`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a pull request.

---

## **License**

This project is licensed under the MIT License - see the LICENSE file for details.

---

## **Future Enhancements**

- **Voice Input and Response**: Enable farmers to ask questions by voice for hands-free use.
- **Real-Time Alerts**: Notify users of significant weather changes or price fluctuations.
- **Expanded Language Options**: Further support for local dialects.

---

## **Contact**

For questions or feedback, please reach out to the maintainers.

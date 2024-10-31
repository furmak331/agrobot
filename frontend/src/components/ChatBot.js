import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [language, setLanguage] = useState('en');

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = {
            text: input,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');

        try {
            const response = await axios.post('http://localhost:5000/api/chat', {
                message: input,
                language: language
            });

            const botMessage = {
                text: response.data.response,
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleWeatherRequest = async (district) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/weather/current/${district}`);
            const weather = response.data.current;
            
            // Format weather message
            const weatherMessage = {
                text: `Weather in ${district}:\n` +
                      `Temperature: ${weather.temperature}°C\n` +
                      `Humidity: ${weather.humidity}%\n` +
                      `Conditions: ${weather.description}\n` +
                      `Wind Speed: ${weather.wind_speed} m/s`,
                sender: 'bot',
                timestamp: new Date()
            };
            
            setMessages(prev => [...prev, weatherMessage]);
            
            // If there's a forecast, add it
            if (response.data.forecast && response.data.forecast.length > 0) {
                const forecastMessage = {
                    text: '5-Day Forecast:\n' + 
                          response.data.forecast.map(day => 
                              `${day.date}: ${day.temperature}°C, ${day.description}`
                          ).join('\n'),
                    sender: 'bot',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, forecastMessage]);
            }
        } catch (error) {
            const errorMessage = {
                text: 'Sorry, I could not fetch the weather information at this time.',
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        }
    };

    const handleQuickAction = async (action) => {
        if (action === 'weather') {
            const userMessage = {
                text: 'Show me the weather forecast',
                sender: 'user',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, userMessage]);
            
            const botResponse = {
                text: 'Please select a district:',
                sender: 'bot',
                timestamp: new Date(),
                options: ['Srinagar', 'Baramulla', 'Anantnag']
            };
            setMessages(prev => [...prev, botResponse]);
        }
        // ... handle other actions ...
    };

    const handleOptionClick = (option) => {
        const userMessage = {
            text: option,
            sender: 'user',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        handleWeatherRequest(option.toLowerCase());
    };

    return (
        <div className="chatbot-container">
            <div className="language-selector">
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option value="en">English</option>
                    <option value="ur">اردو</option>
                    <option value="ks">کٲشُر</option>
                </select>
            </div>
            
            <div className="quick-actions">
                <button onClick={() => handleQuickAction('weather')}>Check Weather</button>
                <button onClick={() => handleQuickAction('crops')}>Recommended Crops</button>
                <button onClick={() => handleQuickAction('pests')}>Identify Pest</button>
                <button onClick={() => handleQuickAction('prices')}>Market Prices</button>
            </div>

            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        {msg.text}
                        {msg.options && (
                            <div className="options-container">
                                {msg.options.map((option, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleOptionClick(option)}
                                        className="option-button"
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="chat-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about crops, weather, or prices..."
                />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};

export default ChatBot;

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

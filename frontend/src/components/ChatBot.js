import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  Typography,
  Container,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  IconButton,
  Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import PestControlIcon from '@mui/icons-material/PestControl';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

function ChatBot() {
  const [messages, setMessages] = useState([
    { 
      text: "Hello! I'm AgroBot, your personal farming assistant. How can I help you today? You can ask me about crops, pests, weather, or farming practices.", 
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([
    "What crops should I plant this month?",
    "How to identify common pests?",
    "Tell me about rice cultivation",
    "Weather forecast for Srinagar"
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    const timestamp = new Date();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, sender: 'user', timestamp }]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Add a slight delay to make the chat feel more natural
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: data.response, 
          sender: 'bot',
          timestamp: new Date(),
          context: data.context
        }]);
        setLoading(false);
      }, 500);
      
      // Update suggestions based on context
      if (data.context && data.context.topic) {
        updateSuggestions(data.context.topic);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: "Sorry, I'm having trouble responding right now. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      }]);
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    // Optional: Automatically send the suggestion
    // setInput('');
    // setMessages(prev => [...prev, { text: suggestion, sender: 'user', timestamp: new Date() }]);
    // Then call handleSend with the suggestion
  };

  const updateSuggestions = (topic) => {
    switch(topic) {
      case 'crop':
        setSuggestions([
          "How much water does rice need?", 
          "When should I harvest wheat?",
          "What are the best crops for clay soil?",
          "How to increase crop yield?"
        ]);
        break;
      case 'pest':
        setSuggestions([
          "How to control aphids naturally?",
          "Identify common rice pests",
          "Organic pest management",
          "Prevention of crop diseases"
        ]);
        break;
      case 'weather':
        setSuggestions([
          "Best crops for rainy season",
          "How to protect crops from frost?",
          "Farming during drought",
          "Weather forecast for next week"
        ]);
        break;
      default:
        setSuggestions([
          "Tell me about sustainable farming",
          "Best practices for organic farming",
          "How to improve soil health?",
          "Local agricultural resources"
        ]);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Container maxWidth="md" sx={{ pt: 3, pb: 5 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          height: '75vh', 
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Box sx={{ bgcolor: '#2e7d32', color: 'white', p: 2, display: 'flex', alignItems: 'center' }}>
          <AgricultureIcon sx={{ mr: 1 }} />
          <Typography variant="h6">AgroBot Assistant</Typography>
        </Box>
        
        {/* Messages area */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2, bgcolor: '#f8f9fa' }}>
          <List>
            {messages.map((message, index) => (
              <ListItem
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2,
                  paddingLeft: 0,
                  paddingRight: 0
                }}
              >
                <Box 
                  sx={{
                    display: 'flex',
                    flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-start',
                    gap: 1,
                    maxWidth: '80%'
                  }}
                >
                  {message.sender === 'bot' && (
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: '#2e7d32',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        mt: 0.5
                      }}
                    >
                      <AgricultureIcon fontSize="small" />
                    </Box>
                  )}
                  
                  <Card
                    elevation={0}
                    sx={{
                      bgcolor: message.sender === 'user' ? '#e3f2fd' : 'white',
                      borderRadius: 2,
                      maxWidth: '100%'
                    }}
                  >
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Typography variant="body1">{message.text}</Typography>
                      
                      {message.context && message.context.topic && (
                        <Box sx={{ mt: 1, display: 'flex', gap: 0.5 }}>
                          <Chip 
                            size="small" 
                            label={message.context.topic}
                            color="primary"
                            icon={
                              message.context.topic === 'crop' ? <LocalFloristIcon /> :
                              message.context.topic === 'pest' ? <PestControlIcon /> :
                              message.context.topic === 'weather' ? <WaterDropIcon /> :
                              <AgricultureIcon />
                            }
                          />
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Box>
                
                <Typography 
                  variant="caption" 
                  sx={{ 
                    mt: 0.5, 
                    color: 'text.secondary',
                    alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    mr: message.sender === 'user' ? 1 : 0,
                    ml: message.sender === 'bot' ? 6 : 0,
                  }}
                >
                  {formatTime(message.timestamp)}
                </Typography>
              </ListItem>
            ))}
            {loading && (
              <ListItem
                sx={{
                  justifyContent: 'flex-start',
                  mb: 2
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: '#2e7d32',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}
                  >
                    <AgricultureIcon fontSize="small" />
                  </Box>
                  <CircularProgress size={24} color="success" />
                </Box>
              </ListItem>
            )}
            <div ref={messagesEndRef} />
          </List>
        </Box>
        
        {/* Suggestions */}
        <Box sx={{ p: 1.5, bgcolor: '#f0f4fa' }}>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mb: 0.5, display: 'block' }}>
            Suggested questions:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {suggestions.map((suggestion, index) => (
              <Chip
                key={index}
                label={suggestion}
                variant="outlined"
                color="success"
                size="small"
                onClick={() => handleSuggestionClick(suggestion)}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        </Box>
        
        <Divider />
        
        {/* Input area */}
        <Box sx={{ p: 2, bgcolor: 'white' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your question about farming..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSend();
                }
              }}
              disabled={loading}
              size="small"
              InputProps={{
                sx: { borderRadius: 3 }
              }}
            />
            <IconButton 
              color="success" 
              sx={{ bgcolor: '#f1f8e9' }}
              disabled={loading}
            >
              <MicIcon />
            </IconButton>
            <Button
              variant="contained"
              color="success"
              endIcon={<SendIcon />}
              onClick={handleSend}
              disabled={loading || !input.trim()}
              sx={{ borderRadius: 3 }}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default ChatBot;

import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Container,
  List,
  ListItem,
  ListItemText,
  Typography 
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);

    try {
      // TODO: Replace with your actual API endpoint
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      
      // Add bot response to chat
      setMessages(prev => [...prev, { text: data.response, sender: 'bot' }]);
    } catch (error) {
      console.error('Error:', error);
    }

    setInput('');
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ height: '80vh', mt: 4, display: 'flex', flexDirection: 'column' }}>
        {/* Chat Messages */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          <List>
            {messages.map((message, index) => (
              <ListItem 
                key={index}
                sx={{
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <Paper 
                  elevation={2}
                  sx={{
                    p: 2,
                    backgroundColor: message.sender === 'user' ? '#e3f2fd' : '#f5f5f5',
                    maxWidth: '70%',
                  }}
                >
                  <Typography>{message.text}</Typography>
                </Paper>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Input Area */}
        <Box sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSend();
                }
              }}
            />
            <Button 
              variant="contained" 
              color="primary"
              endIcon={<SendIcon />}
              onClick={handleSend}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default ChatInterface;

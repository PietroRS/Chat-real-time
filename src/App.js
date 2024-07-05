import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [userName, setUserName] = useState('');
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const socket = useRef()

  useEffect(() => {
    socket.current = new WebSocket('ws://localhost:3001');
  
    socket.onopen = () => {
      console.log('WebSocket connection established.');
    };
  
    socket.current.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      console.log(receivedMessage);
      setMessages([...messages, receivedMessage]);
    };
  
    return () => {
      if (socket.current.readyState === 1) {
        socket.current.close();
    }
    };
  }, [messages]);

  // WebSocket connection setup goes here

  const sendMessage = () => {
    if (messageInput.trim() !== '') {
      const message = {
        userName,
        text: messageInput,
        timestamp: new Date().toISOString(),
      };
      socket.current.send(JSON.stringify(message));
      setMessageInput('');
    }
  };

  return (
    <div className="App">
      <input type="text" placeholder="Enter your name" value={userName} onChange={(e) => setUserName(e.target.value)} />
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.timestamp} className="message">
              {message.userName}: {message.text}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
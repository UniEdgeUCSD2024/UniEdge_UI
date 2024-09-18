import React, { useState, useEffect, useRef } from 'react';
import { VoiceProvider, useVoice } from '@humeai/voice-react';
import { useLocation } from 'react-router-dom';

// Component to display the chat history
const ChatHistory = ({ messages }) => {
  return (
    <div
      style={{
        border: '1px solid #ddd',
        padding: '10px',
        marginTop: '10px',
        height: '300px',
        overflowY: 'auto',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        width: '80%',
        margin: 'auto',
      }}
    >
      <h4 style={{ textAlign: 'center', color: 'black' }}>Chat History</h4>
      {messages.length === 0 && <p style={{ color: 'black' }}>No messages yet</p>}
      {messages.map((message, index) => (
        <div key={index} style={{ color: 'black', margin: '10px 0' }}>
          <strong>{message.sender}: </strong>
          <span>{message.text}</span>
        </div>
      ))}
    </div>
  );
};

const HumeChat = () => {
  const {
    connect,
    disconnect,
    sendUserInput,
    sendSessionSettings,
    lastUserMessage,
    lastVoiceMessage,
    isPlaying,
    error,
  } = useVoice();

  const [userInput, setUserInput] = useState(''); // Text input state
  const [chatHistory, setChatHistory] = useState([]); // Chat history state
  const [isConnecting, setIsConnecting] = useState(false); // To track if voice connection is being established
  const [isConnected, setIsConnected] = useState(false); // To track connection status
  const voiceMessageProcessed = useRef(null); // To track if the voice message was already processed
  const sessionMessages = useRef([]); // To hold messages during a session
  const location = useLocation();
  const { job_title, job_description, resume } = location.state || {};
  const loginState = JSON.parse(localStorage.getItem('login_state'));

  const apiUrl = 'https://uniedge-prospect-functions.azurewebsites.net/storemockinterview';

  // Process both user and assistant messages
  useEffect(() => {
    if (lastUserMessage && !lastUserMessage.fromText && lastUserMessage.message?.content !== voiceMessageProcessed.current) {
      const userMessageContent = lastUserMessage.message?.content || 'Unknown message';
      voiceMessageProcessed.current = userMessageContent;
      setChatHistory((prev) => [...prev, { sender: 'User (Voice)', text: userMessageContent }]);
      sessionMessages.current.push({ sender: 'User (Voice)', text: userMessageContent });
    }

    if (lastVoiceMessage) {
      const assistantMessageContent = lastVoiceMessage.message?.content || 'Unknown message';
      setChatHistory((prev) => [...prev, { sender: 'Assistant', text: assistantMessageContent }]);
      sessionMessages.current.push({ sender: 'Assistant', text: assistantMessageContent });
    }
  }, [lastUserMessage, lastVoiceMessage]);

  // Handle text input submission
  const handleSendMessage = () => {
    if (userInput.trim() !== '') {
      setChatHistory((prev) => [...prev, { sender: 'User (Text)', text: userInput }]);
      sendUserInput(userInput);
      sessionMessages.current.push({ sender: 'User (Text)', text: userInput });
      setUserInput('');
    }
  };

  // Handle voice input by establishing the connection and sending session settings
  const handleVoiceInput = () => {
    if (!isConnecting && !isConnected) {
      setIsConnecting(true);
      connect()
        .then(() => {
          console.log("Connection successful, microphone activated.");
          setIsConnected(true); // Update connection status to true
        })
        .catch((err) => {
          console.error("Error connecting to Hume:", err);
        })
        .finally(() => {
          setIsConnecting(false);
        });
    } else {
      console.log("Connection already open or currently connecting.");
    }
  };

  // Handle disconnection and sending chat history to the API
  const handleDisconnect = async () => {
    disconnect();
    setIsConnected(false); // Reset connection status when disconnected

    if (sessionMessages.current.length > 0 && sessionMessages.current.some((msg) => msg.sender.includes('User'))) {
      const timestamp = new Date().toISOString();
      const fileName = `${loginState.Id}_${job_title}_${timestamp}.json`;

      const payload = {
        filename: fileName,
        chatHistory: sessionMessages.current,
      };

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to send chat history to the API');
        }

        console.log('Chat history successfully sent to the API');
      } catch (err) {
        console.error('Error sending chat history:', err);
      } finally {
        sessionMessages.current = []; // Clear session messages after sending
      }
    }
  };

  useEffect(() => {
    if (error) {
      console.error("Voice connection error:", error.message || error);
      setIsConnected(false); // Reset connection status if an error occurs
    }
  }, [error]);

  return (
    <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
      <h3 style={{ color: 'black', marginTop: '60px', marginBottom: '20px' }}>Mock Interview</h3>

      {/* Buttons */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleVoiceInput}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: isConnected ? '#28a745' : '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isConnected ? 'default' : 'pointer',
          }}
          disabled={isConnected} // Disable button when connected
        >
          {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Connect & Speak Now'}
        </button>
        <button
          onClick={handleDisconnect}
          style={{
            padding: '10px 20px',
            backgroundColor: '#FF6347',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: !isConnected ? 'default' : 'pointer',
          }}
          disabled={!isConnected} // Disable disconnect if not connected
        >
          Disconnect
        </button>
      </div>

      {/* Chat Input */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message here"
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} // Submit message on Enter key press
          style={{
            width: '50%',
            padding: '10px',
            marginRight: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Send
        </button>
      </div>

      {/* Chat History */}
      <ChatHistory messages={chatHistory} />

      {isPlaying && <p style={{ color: 'black', marginTop: '20px' }}>Assistant is speaking...</p>}
    </div>
  );
};

const HumeEmbed = () => {
  const apiKey = process.env.REACT_APP_HUME_API_KEY || '';
  const location = useLocation();
  const { name, job_title, job_description, resume } = location.state || {};

  if (!apiKey) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>Error: Missing Hume API Key</h2>
        <p>Please ensure the API key is correctly set in your environment variables.</p>
      </div>
    );
  }

  const sessionSettings = {
    type: "session_settings",
    custom_session_id: "session1234", // Optional custom session ID
    variables: {
      name: name || 'No Name Provided',  // Interviewee name (can be static or dynamic based on your needs)
      job_title: job_title || 'Unknown Title',  // Job title from passed state
      job_description: job_description || "No job description provided",  // Job description from passed state
      resume: resume || "No resume provided"  // Resume text from passed state
    }
  };

  return (
    <VoiceProvider
      auth={{ type: 'apiKey', value: apiKey }}
      hostname={process.env.REACT_APP_HUME_VOICE_HOSTNAME || 'api.hume.ai'}
      configId='c2881fa5-839f-471f-bbfd-23f6388b30da'
      sessionSettings={sessionSettings}
    >
      <HumeChat />
    </VoiceProvider>
  );
};

export default HumeEmbed;

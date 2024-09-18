import React, { useState, useEffect, useRef } from 'react';
import { VoiceProvider, useVoice } from '@humeai/voice-react';
import { useLocation } from 'react-router-dom';
import { Form, Container, Row, Col, Button } from 'react-bootstrap';

// Component to display the chat history
const ChatHistory = ({ messages }) => {
  return (
    <div
      style={{
        border: '1px solid #ddd',
        padding: '10px',
        marginTop: '10px',
        height: '600px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        width: '100%',
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

  const [userInput, setUserInput] = useState(''); 
  const [chatHistory, setChatHistory] = useState([]); 
  const [isConnecting, setIsConnecting] = useState(false); 
  const [isConnected, setIsConnected] = useState(false); // Track connection status
  const voiceMessageProcessed = useRef(null); 

  const location = useLocation();
  const { name, job_title, job_description, resume } = location.state || {};

  useEffect(() => {
    if (lastUserMessage && !lastUserMessage.fromText && lastUserMessage.message?.content !== voiceMessageProcessed.current) {
      const userMessageContent = lastUserMessage.message?.content || 'Unknown message';
      voiceMessageProcessed.current = userMessageContent;
      setChatHistory((prev) => [
        ...prev,
        { sender: 'User (Voice)', text: userMessageContent },
      ]); 
    }

    if (lastVoiceMessage) {
      const assistantMessageContent = lastVoiceMessage.message?.content || 'Unknown message';
      setChatHistory((prev) => [
        ...prev,
        { sender: 'Assistant', text: assistantMessageContent },
      ]); 
    }
  }, [lastUserMessage, lastVoiceMessage]);

  const handleSendMessage = () => {
    if (userInput.trim() !== '') {
      setChatHistory((prev) => [...prev, { sender: 'User (Text)', text: userInput }]); 
      sendUserInput(userInput); 
      setUserInput(''); 
    }
  };

  const handleVoiceInput = () => {
    if (!isConnecting && !isConnected) {
      setIsConnecting(true);

      connect()
        .then(() => {
          console.log('Connection successful, microphone activated.');
          setIsConnected(true); // Set connection status to true when successful
        })
        .catch((err) => {
          console.error('Error connecting to Hume:', err);
        })
        .finally(() => {
          setIsConnecting(false);
        });
    } else {
      console.log('Connection already open or currently connecting.');
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setIsConnected(false); // Reset connection status after disconnecting
  };

  // Monitor connection status: if the connection is lost, revert the button back
  useEffect(() => {
    if (error) {
      console.error('Voice connection error:', error.message || error);
      setIsConnected(false); // Reset connection status if an error occurs
    }
  }, [error]);

  return (
    <div style={{ padding: '10px', textAlign: 'center', backgroundColor: '#f4f4f4', minHeight: '100vh'}}>
      {/* Buttons */}
      <div style={{ marginBottom: '20px', marginTop: '20px', width: '60%', margin: '0 auto' }}>
        <Button 
          onClick={handleVoiceInput} 
          style={{ marginRight: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', width: '48%' }}
          disabled={isConnected}  // Disable button when connected
        >
          {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Connect & Speak Now'}
        </Button>
        <Button 
          onClick={handleDisconnect} 
          style={{ backgroundColor: '#FF6347', color: 'white', border: 'none', borderRadius: '5px', width: '48%' }}
          disabled={!isConnected}  // Disable disconnect if not connected
        >
          Disconnect
        </Button>
      </div>

      {/* Input Box */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', marginTop: '20px', width: '60%', margin: '0 auto' }}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}  // Handle Enter key press
          placeholder="Type your message here"
          style={{
            width: '80%',
            padding: '10px',
            marginRight: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
        <Button onClick={handleSendMessage} style={{ backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', width: '20%' }}>
          Send
        </Button>
      </div>

      {/* Chat History */}
      <div style={{ 
        width: '90%',  // Increase the width a bit
        height: '600px',  // Increase the height
        margin: '0 auto',
        border: '1px solid #ccc',
        borderRadius: '10px',
        padding: '20px',
        marginTop: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
        overflowY: 'auto'  }}>
        <ChatHistory messages={chatHistory} />
      </div>
    </div>
  );
};

const FreeInterview = () => {
  const apiKey = process.env.REACT_APP_HUME_API_KEY || '';
  const location = useLocation();
  const { name, job_title, job_description, resume } = location.state || {};
  const [selectedJobType, setSelectedJobType] = useState('Any'); 

  const configId = selectedJobType === 'Any'
    ? '6a591a69-6070-471d-b74d-f522975f8c5f'
    : 'acffe4b0-6ae8-416c-ade4-5fba768eaafd';

  const sessionSettings = selectedJobType === 'Any'
    ? {
      type: 'session_settings',
      custom_session_id: 'session1234', 
      variables: {},
      } 
    : {
        type: 'session_settings',
        custom_session_id: 'session1234', 
        variables: {
          job_type: selectedJobType, 
        },
      };

  if (!apiKey) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>Error: Missing Hume API Key</h2>
        <p>Please ensure the API key is correctly set in your environment variables.</p>
      </div>
    );
  }

  const heading = selectedJobType === 'Any' ? 'General Mock Interview' : `${selectedJobType} Mock Interview`;

  return (
    <Container>
      <Row className="justify-content-center mt-5">
          <Col md={6}>
            <div style={{ width: '60%', margin: '0 auto' }}>
              <p style={{ marginBottom: '5px', textAlign: 'left' }}>Interview Job Type</p> 
              <Form.Group controlId="jobTypeSelect" style={{ marginBottom: '20px' }}>
                <Form.Control
                  as="select"
                  value={selectedJobType}
                  onChange={(e) => setSelectedJobType(e.target.value)}
                  style={{ width: '100%', margin: '0 auto' }}
                >
                  <option value="Any">Any</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="Business Analyst">Business Analyst</option>
                  <option value="Product Management">Product Management</option>
                  <option value="Project Management">Project Management</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Consultant">Consultant</option>
                  <option value="HR Management">HR Management</option>
                  <option value="Data Engineer">Data Engineer</option>
                  <option value="Internship">Internship</option>
                </Form.Control>
              </Form.Group>
            </div>
            <h3 style={{ 
              fontWeight: 'bold', 
              marginTop: '20px', 
              textAlign: 'center',  
              width: '100%'  
            }}>
              {heading}
            </h3>
          </Col>
        </Row>

      <Row className="justify-content-center mt-4">
        <Col md={8}>
          <VoiceProvider
            auth={{ type: 'apiKey', value: apiKey }}
            hostname={process.env.REACT_APP_HUME_VOICE_HOSTNAME || 'api.hume.ai'}
            configId={configId} 
            sessionSettings={sessionSettings} 
          >
            <HumeChat />
          </VoiceProvider>
        </Col>
      </Row>
    </Container>
  );
};

export default FreeInterview;

import React, { useRef, useState, useEffect } from 'react';
import {
  Form,
  Button,
  Alert,
  Container,
  Row,
  Col,
  Card,
  Spinner,
} from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [randomText, setRandomText] = useState('');
  const navigate = useNavigate();

  // Define the motivational texts
  const motivationalTexts = [
    'Unlock your potential!',
    'You are closer to success!',
    'Your journey to success continues!',
    'One step closer to your goal!',
    'Welcome back! Ready to achieve more!',
  ];

  // Update the random motivational text when loading starts
  useEffect(() => {
    if (loading) {
      const randomIndex = Math.floor(Math.random() * motivationalTexts.length);
      setRandomText(motivationalTexts[randomIndex]);
    }
  }, [loading]);

  async function handleSubmit(e) {
    e.preventDefault();
  
    // Store the input values in local variables
    const emailValue = emailRef.current ? emailRef.current.value : null;
    const passwordValue = passwordRef.current ? passwordRef.current.value : null;
  
    // Check if any of the inputs are null
    if (!emailValue || !passwordValue) {
      setError('Please fill in both the email and password fields.');
      return;
    }
  
    setError(''); // Clear previous errors
    setLoading(true); // Start loading
  
    try {
      // Firebase login
      await login(emailValue, passwordValue); 
  
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found.');
      }
      // console.log('Token retrieved for backend call:', token);
  
      // Call the backend API with the token
      const response = await fetch(
        'https://uniedge-prospect-functions.azurewebsites.net/checkuser',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: emailValue,
          }),
        }
      );
  
      if (response.ok) {
        const loginState = await response.json();
        localStorage.setItem('login_state', JSON.stringify(loginState));
        navigate('/home'); // Navigate to home after successful login
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to log in.');
      }
    } catch (error) {
      console.error('Error during login or backend call:', error);
      setError(error.message || 'Failed to log in.');
    } finally {
      setLoading(false); // Stop loading
    }
  }
  

  return (
    <Container className='mt-5 pt-5'>
      <Row>
        <Col lg='5' md='6' className='offset-lg-0 offset-md-3'>
          <Card>
            <Card.Body>
              {/* Show "Login" heading only when not loading */}
              {!loading && (
                <h1 className='text-black font-weight-bold text-start'>
                  Login
                </h1>
              )}

              {/* Display error messages */}
              {error && (
                <Alert variant='danger' style={{ backgroundColor: 'red' }}>
                  {error}
                </Alert>
              )}

              {/* Show Spinner and Random Text when loading */}
              {loading ? (
                <div className="text-center">
                  <Spinner
                    animation="border"
                    role="status"
                    className="custom-spinner"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                  <p className="motivational-text">{randomText}</p>
                </div>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId='formBasicEmail'>
                    <Form.Control
                      ref={emailRef}
                      type='email'
                      placeholder='Email'
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId='formBasicPassword' className='mt-3'>
                    <Form.Control
                      ref={passwordRef}
                      type='password'
                      placeholder='Password'
                      required
                    />
                  </Form.Group>

                  <Button
                    disabled={loading}
                    className='mt-4'
                    type='submit'
                    size='lg'
                  >
                    Login
                  </Button>
                </Form>
              )}

              <div className='text-start mt-3'>
                <Link to='/forgotpassword'>Forgot Password?</Link>
              </div>
              <div className='w-100 text-center mt-2'>
                Need an account? <Link to='/register'>Sign Up</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          {/* Placeholder for an image */}
        </Col>
      </Row>
    </Container>
  );
}
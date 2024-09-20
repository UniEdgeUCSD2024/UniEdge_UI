import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  FormCheck,
  FormControl,
  Row,
  Card,
  Spinner,
} from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import './UserSignup.css'; // Import the separate CSS file

export default function UserSignup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  const { signup } = useAuth(); // Firebase signup function from context
  const [error, setError] = useState(''); // For displaying error messages
  const [loading, setLoading] = useState(false); // For spinner state
  const [passwordCriteriaMet, setPasswordCriteriaMet] = useState(false);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const [selectedService, setSelectedService] = useState(searchParams.get('service'));

  const [randomText, setRandomText] = useState('');
  const motivationalTexts = [
    'Empower your future!',
    'You are one step away from success!',
    'Unlock new opportunities!',
    'Make your dreams a reality!',
    'Your journey starts here!',
  ];

  useEffect(() => {
    if (loading) {
      const randomIndex = Math.floor(Math.random() * motivationalTexts.length);
      setRandomText(motivationalTexts[randomIndex]);
    }
  }, [loading]);

  // Function to check if password meets criteria
  function checkPasswordStrength() {
    const password = passwordRef.current.value;
    if (password.length >= 6 && /\d/.test(password)) {
      setPasswordCriteriaMet(true);
    } else {
      setPasswordCriteriaMet(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
  
    // Store the ref values locally before making any async call
    const emailValue = emailRef.current ? emailRef.current.value : null;
    const passwordValue = passwordRef.current ? passwordRef.current.value : null;
    const passwordConfirmValue = passwordConfirmRef.current ? passwordConfirmRef.current.value : null;
  
    // Check for null values or empty inputs
    if (!emailValue || !passwordValue || !passwordConfirmValue) {
      return setError('Please fill in all fields.');
    }
  
    if (passwordValue !== passwordConfirmValue) {
      return setError('Passwords do not match.');
    }
  
    try {
      setError(''); // Clear previous errors
      setLoading(true); // Start showing spinner
  
      // Call Firebase signup (will throw an error if something goes wrong)
      await signup(emailValue, passwordValue);
  
      // After successful Firebase signup, get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }
      console.log('Token retrieved:', token);
  
      // Proceed with backend API call
      const user_reg = {
        email: emailValue,
        service: selectedService,
        password: passwordValue,
      };
  
      const apiUrl = 'https://uniedge-prospect-functions.azurewebsites.net/createuser';
  
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Use the token from Firebase
        },
        body: JSON.stringify(user_reg),
      });
  
      if (response.ok) {
        const user_status = await response.json();
        updateRegisterState(user_status); // Update state after successful backend call
        navigate('/home'); // Redirect to home page
      } else {
        const errorResponse = await response.json();
        console.error('API Error Response:', errorResponse);
        handleBackendErrors(errorResponse);
      }
    } catch (error) {
      console.error('Error during signup or API call:', error);
      setError(error.message); // Show the error message returned from signup
    } finally {
      setLoading(false); // Stop showing spinner
    }
  }
  

  // Function to handle Firebase errors
  function handleFirebaseErrors(firebaseError) {
    const sdkErrorMessage = firebaseError.message;

    switch (sdkErrorMessage) {
      case 'EMAIL_EXISTS':
      case 'auth/email-already-in-use':
        setError('The email you entered is already registered. Please login or use a different email.');
        break;
      case 'INVALID_EMAIL':
      case 'auth/invalid-email':
        setError('The email address is not valid. Please enter a valid email.');
        break;
      case 'WEAK_PASSWORD':
      case 'auth/weak-password':
        setError('The password is too weak. Please use a stronger password.');
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
      case 'auth/too-many-requests':
        setError('Too many attempts. Please try again later.');
        break;
      case 'OPERATION_NOT_ALLOWED':
      case 'auth/operation-not-allowed':
        setError('Email/password accounts are not enabled. Please contact support.');
        break;
      default:
        setError('An unknown error occurred. Please try again later.');
    }
  }

  // Function to handle backend errors
  function handleBackendErrors(errorResponse) {
    if (errorResponse.error) {
      if (errorResponse.error === 'Duplicate entry. The email already exists.') {
        setError('The email you entered is already registered. Please use a different email.');
      } else if (errorResponse.error === 'Email is required') {
        setError('Email is required to create an account.');
      } else {
        setError(errorResponse.error);
      }
    } else {
      setError('An unknown error occurred. Please try again later.');
    }
  }

  // Function to update register state in localStorage
  function updateRegisterState(user_status) {
    window.localStorage.setItem('login_state', JSON.stringify(user_status));
    window.dispatchEvent(new Event('loginStateUpdated'));
  }

  return (
    <Container className="d-flex flex-column align-items-center mt-5 pt-5">
      <Row className="justify-content-center w-100">
        <Col lg={5} md={8}>
          <Card className="signup-card">
            <Card.Body>
              {!loading && (
                <h1 className="font-weight-bold text-center mb-4 signup-header">
                  Register
                </h1>
              )}

              {error && (
                <Alert variant="danger" className="error-alert">
                  {error}
                </Alert>
              )}

              {loading ? (
                <div className="text-center loading-section">
                  <Spinner animation="border" role="status" className="custom-spinner">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                  <p className="motivational-text">{randomText}</p>
                </div>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <FormControl
                      ref={emailRef}
                      placeholder="Email"
                      type="email"
                      required
                      className="form-control-custom"
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormControl
                      ref={passwordRef}
                      placeholder="Password"
                      type="password"
                      required
                      className="form-control-custom"
                      onChange={checkPasswordStrength}
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormControl
                      ref={passwordConfirmRef}
                      placeholder="Confirm Password"
                      type="password"
                      required
                      className="form-control-custom"
                    />
                  </FormGroup>

                  <ul className="password-criteria text-dark">
                    <li>Password must be at least 6 characters long</li>
                    <li>Password must contain at least one number</li>
                  </ul>

                  <FormGroup className="mt-3">
                    <FormCheck>
                      <FormCheck.Input type="checkbox" required />
                      <FormCheck.Label>
                        I agree to the{' '}
                        <Link to="#" onClick={(e) => e.preventDefault()}>
                          terms and conditions
                        </Link>
                        .
                      </FormCheck.Label>
                    </FormCheck>
                  </FormGroup>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-100 signup-btn mt-4"
                    disabled={!passwordCriteriaMet || loading}
                  >
                    Sign Up
                  </Button>
                </Form>
              )}

              <div className="text-center mt-4">
                Already have an account?{' '}
                <Link to="/login" className="text-decoration-none signup-link">
                  Log In
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

import React, { useRef, useState } from 'react';
import {
  Form,
  Button,
  Alert,
  Container,
  Row,
  Col,
  Card,
} from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      const token = localStorage.getItem('token');

      const response = await fetch(
        'https://uniedge-prospect-functions.azurewebsites.net/checkuser',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: emailRef.current.value,
          }),
        }
      );

      if (response.ok) {
        const loginState = await response.json();
        localStorage.setItem('login_state', JSON.stringify(loginState));
        navigate('/home');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to log in');
      }
    } catch (error) {
      console.error(error);
      setError('Failed to log in');
    }
    setLoading(false);
  }

  return (
    <Container className='mt-5 pt-5'>
      <Row>
        <Col lg='5' md='6' className='offset-lg-0 offset-md-3'>
          <Card>
            <Card.Body>
              <h1 className='text-black font-weight-bold text-start'>Login</h1>

              {error && (
                <Alert variant='danger' style={{ backgroundColor: 'red' }}>
                  {error}
                </Alert>
              )}
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
          {/* <img
            width={"60%"}
            style={{ float: "right" }}
            alt="..."
            className="img-fluid"
            src={require("../assets/img/peel.png")}
          /> */}
        </Col>
      </Row>
    </Container>
  );
}

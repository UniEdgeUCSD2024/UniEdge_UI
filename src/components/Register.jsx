import React, { useRef, useState } from 'react';
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
} from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

export default function UserSignup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const [selectedService, setSelectedService] = useState(
    searchParams.get('service')
  );

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      const user_reg = {
        email: emailRef.current.value,
        service: selectedService,
        password: passwordRef.current.value,
      };
      const apiUrl =
        'https://uniedge-prospect-functions.azurewebsites.net/createuser';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(user_reg),
      });

      if (response.ok) {
        const user_status = await response.json();
        updateRegisterState(user_status);
        navigate('/home');
      } else {
        setError('Failed to create account.');
      }
    } catch (error) {
      console.error(error);
      setError('Failed to create account.');
    }
    setLoading(false);
  }

  function updateRegisterState(user_status) {
    window.localStorage.setItem('login_state', JSON.stringify(user_status));
    window.dispatchEvent(new Event('loginStateUpdated'));
  }

  return (
    <Container className='mt-5 pt-5'>
      <Row>
        <Col className='offset-lg-0 offset-md-3 g-3' lg={5} md={6}>
          <Card>
            <Card.Body>
              <h1 className='font-weight-bold'>Register</h1>

              {error && (
                <Alert variant='danger' style={{ backgroundColor: 'red' }}>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <FormControl
                  ref={emailRef}
                  placeholder='Email'
                  type='email'
                  required
                />

                <FormControl
                  className='mt-3'
                  ref={passwordRef}
                  placeholder='Password'
                  type='password'
                  required
                />

                <FormControl
                  className='mt-3'
                  ref={passwordConfirmRef}
                  placeholder='Confirm Password'
                  type='password'
                  required
                />

                <FormGroup className='mt-3'>
                  <FormCheck>
                    <FormCheck.Input type='checkbox' required />
                    <FormCheck.Label>
                      I agree to the{' '}
                      <Link to='#' onClick={(e) => e.preventDefault()}>
                        terms and conditions
                      </Link>
                      .
                    </FormCheck.Label>
                  </FormCheck>
                </FormGroup>

                <Button
                  disabled={loading}
                  type='submit'
                  size='lg'
                  className='mt-4'
                >
                  Sign Up
                </Button>
              </Form>

              <div className='text-center mt-3'>
                Already have an account? <Link to='/login'>Log In</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col>{/* Add your image or additional content here if needed */}</Col>
      </Row>
    </Container>
  );
}

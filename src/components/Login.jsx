import React, { useRef, useState } from 'react';
import { Form, Button, Alert, Container, Row, Col, Input } from 'reactstrap';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useNavigate();

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
        history('/home');
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
    <>
      <div className='wrapper'>
        <div className='page-header'>
          <div className='content'>
            <Container>
              <Row>
                <Col className='offset-lg-0 offset-md-3' lg='5' md='6'>
                  <h1 className='text-black font-weight-bold text-start'>
                    Login
                  </h1>

                  {error && (
                    <Alert variant='danger' style={{ backgroundColor: 'red' }}>
                      {error}
                    </Alert>
                  )}
                  <Form className='form'>
                    <Input
                      innerRef={emailRef}
                      placeholder='Email'
                      type='text'
                    />
                    <Input
                      style={{ marginTop: '1rem' }}
                      innerRef={passwordRef}
                      placeholder='Password'
                      type='password'
                    />
                  </Form>

                  <div className='d-flex'>
                    <Button
                      disabled={loading}
                      className='btn-round'
                      color='info'
                      size='lg'
                      onClick={handleSubmit}
                    >
                      Login
                    </Button>
                  </div>

                  <div className='text-start'>
                    <Link to='/forgotpassword'>Forgot Password?</Link>
                  </div>
                  <div className='w-100 text-center mt-2'>
                    Need an account? <Link to='/register'>Sign Up</Link>
                  </div>
                </Col>
                <Col>
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
          </div>
        </div>
      </div>
    </>
  );
}

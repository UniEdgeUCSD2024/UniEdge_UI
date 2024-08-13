import React, { useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';
import { useAuth } from '../context/AuthContext';

export default function UserSignup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  const { signup, currentUser } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useNavigate();

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

      console.log('done');
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(user_reg),
      })
        .then((response) => response.json())
        .then((data) => {
          const user_status = data;
          if (user_status) {
            updateRegisterState(user_status);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });

      history('/recruiter');
    } catch (error) {
      console.error(error);
      let errorMessage = '';
      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage =
              'The email address is already in use by another account.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'The email address is not valid.';
            break;
          case 'auth/weak-password':
            errorMessage = 'The password is too weak.';
            break;
          default:
            errorMessage = 'Failed to Create an Account';
        }
      }
      setError(errorMessage);
    }
    setLoading(false);
  }

  function updateRegisterState(user_status) {
    window.localStorage.setItem('login_state', JSON.stringify(user_status));
    window.dispatchEvent(new Event('loginStateUpdated'));
  }

  return (
    <>
      <>
        <div className='wrapper'>
          <div className='page-header'>
            <div className='content'>
              <Container>
                <Row>
                  <Col className='offset-lg-0 offset-md-3 g-3' lg='5' md='6'>
                    <h1 className=' font-weight-bold h1'>Register</h1>

                    {error && (
                      <Alert
                        variant='danger'
                        style={{ backgroundColor: 'red' }}
                      >
                        {error}
                      </Alert>
                    )}
                    <Form className='form' onSubmit={handleSubmit}>
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
                      <Input
                        style={{ marginTop: '1rem' }}
                        innerRef={passwordConfirmRef}
                        placeholder='Confirm Password'
                        type='password'
                      />

                      {/* service select - with options: professional-prospects, personal-prospects,mentoring,life-coaching,volunteering */}

                      <FormGroup check className='text-left'>
                        <Label check>
                          <Input type='checkbox' />
                          <span className='form-check-sign' />
                          <span className='text-black'>I agree to the </span>
                          <a href='#pablo' onClick={(e) => e.preventDefault()}>
                            terms and conditions
                          </a>
                          .
                        </Label>
                      </FormGroup>
                    </Form>

                    <Button
                      disabled={loading}
                      className='btn-round'
                      color='info'
                      size='lg'
                      onClick={handleSubmit}
                    >
                      Sign Up
                    </Button>

                    <div className='text-center'>
                      Already have an account? <Link to='/login'>Log In</Link>
                    </div>
                  </Col>
                  <Col>
                    {/* <img
                      width={"60%"}
                      style={{ float: "right" }}
                      alt="..."
                      className="img-fluid"
                      src={require("../assets/img/field.png")}
                    /> */}
                  </Col>
                </Row>
              </Container>
            </div>
          </div>
        </div>
      </>
    </>
  );
}

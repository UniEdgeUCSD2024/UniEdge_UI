import React, { useRef, useState } from 'react';
import {
  Form,
  Button,
  Card,
  Alert,
  Container,
  Row,
  Col,
  Input,
  Label,
  CardHeader,
  CardImg,
  CardBody,
  CardTitle,
  FormGroup,
  CardFooter,
} from 'reactstrap';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { startCase } from 'lodash';

export default function UserSignup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const userNameRef = useRef();
  const { signup, currentUser } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useNavigate();
  const token = localStorage.getItem('token');

  const [searchParams] = useSearchParams();
  const [selectedService, setSelectedService] = useState(
    searchParams.get('service')
  );

  async function handleSubmit(e) {
    e.preventDefault();

    const role = document.querySelector('input[name="role"]:checked')?.value;
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await signup(
        emailRef.current.value,
        userNameRef.current.value,
        passwordRef.current.value,
        role
      );
      const user_reg = {
        email: emailRef.current.value,
        role: role,
        username: userNameRef.current.value,
        service: selectedService,
      };
      const apiUrl = 'https://uniedge-functions.azurewebsites.net/createuser';
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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

      if (role == 'Student') {
        history('/student');
      } else {
        history('/recruiter');
      }
    } catch (error) {
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
                  <Col className='offset-lg-0 offset-md-3' lg='5' md='6'>
                    <Card className='card-register'>
                      <CardHeader>
                        <CardImg
                          alt='...'
                          src={require('../assets/img/square-gold.png')}
                        />
                        <CardTitle tag='h3'>Register</CardTitle>
                      </CardHeader>
                      <CardBody>
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
                            innerRef={userNameRef}
                            placeholder='User Name'
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
                          <Input
                            type='select'
                            name='service'
                            style={{ marginTop: '1rem' }}
                            value={selectedService}
                            onChange={(e) => setSelectedService(e.target.value)}
                          >
                            <option value='default'>Default</option>
                            {[
                              'professional-prospects',
                              'personal-prospects',
                              'mentoring',
                              'life-coaching',
                              'volunteering',
                            ].map((service) => (
                              <option key={service} value={service}>
                                {startCase(service)}
                              </option>
                            ))}
                          </Input>
                          <FormGroup check className='text-left'>
                            <Label check>
                              <Input type='checkbox' />
                              <span className='form-check-sign' />I agree to the{' '}
                              <a
                                href='#pablo'
                                onClick={(e) => e.preventDefault()}
                              >
                                terms and conditions
                              </a>
                              .
                            </Label>
                          </FormGroup>
                        </Form>
                      </CardBody>
                      <CardFooter>
                        <Button
                          disabled={loading}
                          className='btn-round'
                          color='info'
                          size='lg'
                          onClick={handleSubmit}
                        >
                          Sign Up
                        </Button>
                      </CardFooter>
                    </Card>
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

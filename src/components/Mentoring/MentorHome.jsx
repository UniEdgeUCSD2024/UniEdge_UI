import React, { useContext, useState, useEffect } from 'react';
import Footer from '../Footer/Footer';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Spinner, Button, Col, Container, Row } from 'react-bootstrap';

export default function MentorHome() {
  const navigate = useNavigate();
  const { userKeys } = useContext(AuthContext);
  const [storedLoginState, setLoginState] = useState(null);
  const [isLoginStateChecked, setIsLoginStateChecked] = useState(false);

  useEffect(() => {
    const loginState = JSON.parse(window.localStorage.getItem('login_state'));
    if (loginState) {
      setLoginState(loginState);
      setIsLoginStateChecked(true);
    } else {
      setIsLoginStateChecked(false);
    }
  }, []);

  if (!isLoginStateChecked) {
    return (
      <div className='d-flex flex-column align-items-center justify-content-center vh-100'>
        <Spinner
          animation='border'
          role='status'
          style={{ width: '3rem', height: '3rem' }}
        />
        <p className='mt-3'>
          Hello, we're just confirming your login details. Hang tight!!!
        </p>
      </div>
    );
  }

  return (
    <div>
      <Container>
        <Row className='row-grid justify-content-between'>
          <Col md='5'>
            <div className='content-center brand' style={{ marginTop: '5rem' }}>
              <h2 className='title'>Elevate Your Growth with Mentorship</h2>
              <h4 className='description'>
                Hey {userKeys ? userKeys.username : ''},We know that the right guidance can be a game-changer in your personal and professional growth. Whether you're on the lookout for a mentor to help you climb the career ladder or eager to share your wisdom and shape the future of others, we've got your back. Explore tailored mentoring, gain insights from seasoned mentors, and connect with a community of like-minded individuals.
              </h4>
              <Button color='info' onClick={() => navigate('/mentorship/mentor/profile')}>
                Be a Mentor
              </Button>
              <Button
                color='success'
                onClick={() => navigate('/')}
                className='ms-2'
              >
                Find a Mentor
              </Button>
            </div>
          </Col>
          <Col md='6'>
            {/* First page picture */}
            {/* <CoverPicture /> */}
          </Col>
        </Row>

        <Row className='justify-content-center my-5 py-5'>
          <Col lg='12'>
            <h1 className='text-center'>Our Benefits</h1>
            <Row className='row-grid justify-content-center'>
              <Col lg='3' className='text-center'>
                <div className='info'>
                  <div className='icon icon-warning'>
                    <i className='tim-icons icon-link-72' />
                  </div>
                  <h4 className='info-title'>Internship Listings</h4>
                  <p>Find the Latest Internship Listings</p>
                </div>
              </Col>
              <Col lg='3' className='text-center'>
                <div className='info'>
                  <div className='icon icon-danger'>
                    <i className='tim-icons icon-lock-circle' />
                  </div>
                  <h4 className='info-title'>Precision Match</h4>
                  <p>Your Compatibility Compass</p>
                </div>
              </Col>
              <Col lg='3' className='text-center'>
                <div className='info'>
                  <div className='icon icon-primary'>
                    <i className='tim-icons icon-chart-pie-36' />
                  </div>
                  <h4 className='info-title'>Curated Coaching</h4>
                  <p>Customized Coaching for Career Success</p>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      <Footer />
    </div>
  );
}

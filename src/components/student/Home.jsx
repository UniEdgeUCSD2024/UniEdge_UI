import React, { useContext, useState, useEffect } from 'react';
import Footer from '../Footer/Footer';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Spinner, Button, Col, Container, Row } from 'react-bootstrap';

export default function StudentHome() {
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
    <>
      <Container className='py-5 mt-5'>
        <Row className='align-items-center'>
          <Col md={6}>
            <h2 className='fw-bold'>Empowering Your Job Hunt Journey</h2>
            <p className='lead'>
              Hey {userKeys ? userKeys.username : ''}, UniEdge understands the
              challenges university students face in today's competitive job
              market. That's why we're dedicated to supporting your career
              ambitions. Explore our tailored job search services, leverage
              curated coaching, and gain an edge with UniEdge. Let's navigate
              this journey together and unlock the doors to your professional
              future.
            </p>
            <Button
              variant='info'
              className='me-2'
              onClick={() => navigate('/internships')}
            >
              Explore Internships
            </Button>
            <Button variant='success' onClick={() => navigate('/jobs/poster')}>
              Gain Edge with Our Services
            </Button>
          </Col>
          <Col md={6}>
            {/* Placeholder for an image or component */}
            {/* <CoverPicture /> */}
          </Col>
        </Row>
      </Container>

      <Container className='py-5 '>
        <Row className='text-center'>
          <Col>
            <h1 className='mb-5'>Our Services</h1>
          </Col>
        </Row>
        <Row className='g-4 text-center'>
          <Col lg={4} sm={6}>
            <div>
              <div className='mb-3'>
                <i
                  className='tim-icons icon-link-72 text-warning'
                  style={{ fontSize: '3rem' }}
                />
              </div>
              <h4>Internship Listings</h4>
              <p>Find the Latest Internship Listings</p>
            </div>
          </Col>
          <Col lg={4} sm={6}>
            <div>
              <div className='mb-3'>
                <i
                  className='tim-icons icon-lock-circle text-danger'
                  style={{ fontSize: '3rem' }}
                />
              </div>
              <h4>Precision Match</h4>
              <p>Your Compatibility Compass</p>
            </div>
          </Col>
          <Col lg={4} sm={6}>
            <div>
              <div className='mb-3'>
                <i
                  className='tim-icons icon-chart-pie-36 text-primary'
                  style={{ fontSize: '3rem' }}
                />
              </div>
              <h4>Curated Coaching</h4>
              <p>Customized Coaching for Career Success</p>
            </div>
          </Col>
        </Row>
      </Container>

      <Footer />
    </>
  );
}

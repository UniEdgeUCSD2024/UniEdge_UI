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
      <div className='wrapper'>
        <section className='section section-lg section-safe'>
          <Container>
            <Row className='row-grid justify-content-between'>
              <Col md='5'>
                <div
                  className='content-center brand'
                  style={{ marginTop: '5rem' }}
                >
                  <h2 className='title'>Empowering Your Job Hunt Journey</h2>
                  <h4 className='description'>
                    Hey {userKeys ? userKeys.username : ''}, UniEdge understands
                    the challenges in today's job market. Whether you're seeking
                    a career or top talent, we're here to help. Explore tailored
                    job services, access expert coaching, and connect with the
                    best opportunities or candidates. Together, let's unlock
                    your professional future.
                  </h4>
                  <Button color='info' onClick={() => navigate('/internships')}>
                    Job Seeker
                  </Button>
                  <Button color='success' onClick={() => navigate('/services')}>
                    Job Poster
                  </Button>
                </div>
              </Col>
              <Col md='6'>
                {/* First page picture */}
                {/* <CoverPicture /> */}
              </Col>
            </Row>
          </Container>
        </section>
        <section className='section section-lg'>
          <Container>
            <Row className='justify-content-center'>
              <Col lg='12'>
                <h1 className='text-center' style={{ marginBottom: '-5%' }}>
                  Our Benefits
                </h1>
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
        </section>
        <Footer />
      </div>
    </>
  );
}

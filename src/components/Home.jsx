import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Container, Row } from 'reactstrap';
import Footer from './Footer/Footer';

export default function Home() {
  const navigate = useNavigate();

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
                  <h2 className='title'>
                    Bridging the Gap Between Students and Recruiters
                  </h2>
                  <h4 className='description'>
                    Our platform is crafted to empower university students and
                    recruiters, offering an optimal matchmaking experience that
                    significantly enhances the job search for students while
                    enabling recruiters to discover top talent that meets their
                    specific needs.
                  </h4>
                  <Button color='success' onClick={() => navigate('/register')}>
                    Register with us
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
                  Why UniEdge?
                </h1>
                <Row className='row-grid justify-content-center'>
                  <Col lg='3' className='text-center'>
                    <div className='info'>
                      <div className='icon icon-warning'>
                        <i className='tim-icons icon-link-72' />
                      </div>
                      <h4 className='info-title'>Enhanced Matching</h4>
                    </div>
                  </Col>
                  <Col lg='3' className='text-center'>
                    <div className='info'>
                      <div className='icon icon-danger'>
                        <i className='tim-icons icon-lock-circle' />
                      </div>
                      <h4 className='info-title'>Curated Coaching</h4>
                    </div>
                  </Col>
                  <Col lg='3' className='text-center'>
                    <div className='info'>
                      <div className='icon icon-primary'>
                        <i className='tim-icons icon-chart-pie-36' />
                      </div>
                      <h4 className='info-title'>Recruiter Efficiency</h4>
                    </div>
                  </Col>
                  <Col lg='3' className='text-center'>
                    <div className='info'>
                      <div className='icon icon-success'>
                        <i className='tim-icons icon-spaceship' />
                      </div>
                      <h4 className='info-title'>
                        Onestop Solution for Recruiters & Students
                      </h4>
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

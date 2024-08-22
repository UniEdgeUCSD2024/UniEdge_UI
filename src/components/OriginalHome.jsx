import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Container,
  Row,
} from 'reactstrap';
import Footer from './Footer/Footer';
import communitySupport from '../assets/img/community support.png';
import comprehensiveResources from '../assets/img/Comprehensive Resources.png';
import personalizedMatching from '../assets/img/Personalized Matching.png';

import { startCase } from 'lodash';

const SERVICES = [
  {
    key: 'ai-driven-prospecting',
    title: 'AI Driven Prospecting',
    subtitle: 'Find Professional and Personal Prospects, Opportunities',
    description:
      'Embark on your next adventure with the ideal match. Together, we build lasting connections, whether for a career, mentoring, or partnering. Find your perfect connection with us, enabling advanced cognition for precision and success.',
  },
  {
    key: 'professional-prospects',
    title: 'Unlock Your Professional Potential',
    subtitle: 'Discover Career-Enhancing Connections and Opportunities',
    description:
      'Empower your career journey with our AI-driven platform, bridging talent with opportunities and driving success in careers and recruitment. Achieve your goals with precision-matched connections.',
  },
  {
    key: 'mentoring',
    title: 'Transform Your Mentoring Journey',
    subtitle: 'Discover Life-Changing Mentorship Connections',
    description:
      'Our platform empowers mentees and mentors, providing an optimal matchmaking experience connecting mentors and mentees to foster growth and success. Discover individuals who align with your expertise and guidance.',
  },
];

function getData(service) {
  return (
    SERVICES.find((s) => s.key === service) || {
      ...SERVICES[0],
      title: startCase(service) || SERVICES[0].title,
    }
  );
}

export default function OriginalHome() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const service = searchParams.get('service');

  return (
    <>
      <section>
        <Container className='landing-container mb-5'>
          <h1 className='landing-heading'>{getData(service).title}</h1>
          <h2 className='landing-tagline'>{getData(service).subtitle}</h2>
          {/* descripiton */}
          <h3 className='landing-description font-weight-light'>
            {getData(service).description}
          </h3>
          {/* get started */}
          <div className='d-flex justify-content-center'>
            {/* post a job */}

            <Button
              className='btn-round btn-lg landing-button'
              color='primary'
              onClick={() =>
                navigate({
                  pathname: '/register',
                  search: service ? `?service=${service}` : '',
                })
              }
            >
              Get Started <i className='tim-icons icon-minimal-right' />
            </Button>
          </div>
        </Container>
      </section>

      <section className='section section-lg py-5'>
        {/* benefits heading in center */}
        <h1 className='h1 font-weight-bold text-center'>Our Benefits</h1>
        <Container>
          <div className='d-flex justify-content-center flex-column flex-md-row'>
            {[
              {
                title: 'Personalized Matching',
                description:
                  'Experience tailored recommendations that match your unique skills and aspirations. Our advanced algorithms ensure you connect with the best opportunities for your professional and personal growth.',
                image: personalizedMatching,
                // image: connectingTeams,
              },
              {
                title: 'Comprehensive Resources',
                description:
                  'Access a wealth of resources to boost your career and personal development. From expert mentorship to skill-building workshops, we provide the tools you need to succeed.',
                image: comprehensiveResources,
                // image: knowledge,
              },
              {
                title: 'Community Support',
                description:
                  'Join a supportive community of like-minded individuals and professionals. Engage in meaningful networking, share experiences, and find encouragement to achieve your goals.',
                image: communitySupport,
                // image: googleDocs,
              },
            ].map((benefit, index) => {
              return (
                <div key={index} className='h-100 m-4'>
                  <div className='row justify-content-start align-items-center border-light position-relative cardContainer p-4 h-full m-0 bg-black overflow-hidden text-white h-100'>
                    <img
                      src={benefit.image}
                      alt={benefit.title}
                      width={'100%'}
                      height={'100%'}
                      style={{
                        objectFit: 'cover',
                        top: 0,
                        left: 0,
                        right: 0,
                        opacity: 0.2,
                        width: '100%',
                        height: '100%',
                        objectPosition: 'center',
                      }}
                      className='position-absolute'
                    />

                    {/* gradient overly */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                          'linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%)',
                      }}
                    ></div>

                    <div className='col'>
                      <h2 className='font-weight-bold text-white'>
                        {benefit.title}
                      </h2>
                      <p className='text-white'>{benefit.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className=''>
        <Container>
          <Row className='justify-content-center mb-5'>
            <Col lg='12'>
              <h1 className='text-center font-weight-bold mb-4'>
                Our Services
              </h1>

              <div className='d-flex justify-content-around flex-column flex-md-row'>
                {[
                  {
                    title: 'Professional Prospects',
                    description:
                      "Engage with top recruiters and explore exciting opportunities. Whether you're a recent graduate or a seasoned professional, we connect you with companies that value your skills and aspirations.",
                    link: '/professional-prospects',
                  },
                  {
                    title: 'MENTORING',
                    description:
                      "Discover the ideal investors and mentors to propel your organization's success. Our platform connects organizations with industry experts who share your vision and can help you realize the full potential of your ideas.",
                    link: '/mentoring',
                  },
                  {
                    title: 'Volunteering',
                    description:
                      'Connects students with organizations to unlock volunteer opportunities. Enhance skills and networks while organizations gain fresh, energetic contributions, strengthening communities and fostering future leaders.',
                    link: '/volunteering',
                  },
                ].map((service) => (
                  <div key={service.title} className='h-100 px-4 w-fit'>
                    <Card className='cardContainer bg-black text-white p-3 h-full'>
                      <CardBody>
                        <CardTitle
                          tag='h2'
                          className='font-weight-bold text-white'
                        >
                          {service.title}
                        </CardTitle>
                        <CardText className='text-white'>
                          {service.description}
                        </CardText>
                        <Button
                          className='btn-round mt-3'
                          color='primary'
                          onClick={() => navigate(service.link)}
                        >
                          Learn More
                        </Button>{' '}
                        {/* Changed color to success */}
                      </CardBody>
                    </Card>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <Footer />
    </>
  );
}

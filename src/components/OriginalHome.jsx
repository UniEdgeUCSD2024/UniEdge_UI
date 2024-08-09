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

import connectingTeams from '../assets/img/undraw_connecting_teams_re_hno7.svg';
import googleDocs from '../assets/img/undraw_google_docs_re_evm3.svg';
import knowledge from '../assets/img/undraw_knowledge_re_5v9l.svg';

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
  return SERVICES.find((s) => s.key === service) || SERVICES[0];
}

export default function OriginalHome() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const service = searchParams.get('service');

  return (
    <>
      <section className='section section-lg section-safe'>
        <Container className='landing-container'>
          <h1 className='landing-heading'>{getData(service).title}</h1>
          <h2 className='landing-tagline'>{getData(service).subtitle}</h2>
          {/* descripiton */}
          <h3 className='landing-description font-weight-light'>
            {getData(service).description}
          </h3>
          {/* get started */}
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
        </Container>
      </section>

      <section className='section section-lg'>
        {/* benefits heading in center */}
        <h1 className='h1 font-weight-bold text-center'>Our Benefits</h1>

        <Row className='px-4'>
          {[
            {
              title: 'Personalized Matching',
              description:
                'Experience tailored recommendations that match your unique skills and aspirations. Our advanced algorithms ensure you connect with the best opportunities for your professional and personal growth.',
              // image: personalizedMatching,
              image: connectingTeams,
            },
            {
              title: 'Comprehensive Resources',
              description:
                'Access a wealth of resources to boost your career and personal development. From expert mentorship to skill-building workshops, we provide the tools you need to succeed.',
              // image: comprehensiveResources,
              image: knowledge,
            },
            {
              title: 'Community Support',
              description:
                'Join a supportive community of like-minded individuals and professionals. Engage in meaningful networking, share experiences, and find encouragement to achieve your goals.',
              // image: communitySupport,
              image: googleDocs,
            },
          ].map((benefit, index) => {
            return (
              <Col key={index} className='p-5' lg={12 / 3} xs={12}>
                <div className='row p-4 justify-content-start align-items-center rounded-pill  border-light align-items-center'>
                  <img
                    src={benefit.image}
                    alt={benefit.title}
                    width={180}
                    height={180}
                    className='col-auto'
                  />

                  <div className='col'>
                    <h2 className='font-weight-bold'>{benefit.title}</h2>
                    <p>{benefit.description}</p>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </section>

      <section className=''>
        <Container>
          <Row className='justify-content-center'>
            <Col lg='12'>
              <h1 className='text-center font-weight-bold mb-4'>
                Our Services
              </h1>

              <Row>
                <Col md='4'>
                  <Card className='card-plain'>
                    <CardBody>
                      <CardTitle tag='h2' className='font-weight-bold'>
                        Link Up Volunteering
                      </CardTitle>
                      <CardText>
                        Connects students with organizations to unlock volunteer
                        opportunities. Enhance skills and networks while
                        organizations gain fresh, energetic contributions,
                        strengthening communities and fostering future leaders.
                      </CardText>
                      <Button
                        className='btn-round'
                        color='primary'
                        onClick={() => navigate('/volunteer')}
                      >
                        Learn More
                      </Button>{' '}
                      {/* Changed color to success */}
                    </CardBody>
                  </Card>
                </Col>
                <Col md='4'>
                  <Card className='card-plain'>
                    <CardBody>
                      <CardTitle tag='h2' className='font-weight-bold'>
                        UniEdge
                      </CardTitle>
                      <CardText>
                        Engage with top recruiters and explore exciting
                        opportunities. Whether a recent graduate or seasoned
                        professional, we'll connect you with companies that
                        value your skills and aspirations.
                      </CardText>
                      <Button
                        className='btn-round'
                        color='primary'
                        onClick={() => navigate('/uniedge')}
                      >
                        Learn More
                      </Button>
                    </CardBody>
                  </Card>
                </Col>

                <Col md='4'>
                  <Card className='card-plain'>
                    <CardBody>
                      <CardTitle tag='h2' className='font-weight-bold'>
                        Mentoring
                      </CardTitle>
                      <CardText>
                        Discover the ideal investors and mentors to propel your
                        organization's success. Our platform connects
                        organizations with industry experts who share your
                        vision and can help you realize the full potential of
                        your ideas.{' '}
                      </CardText>
                      <Button
                        className='btn-round'
                        color='primary'
                        onClick={() => navigate('/mentoringlanding')}
                      >
                        Learn More
                      </Button>
                      {/* Changed color to success */}
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
      <Footer />
    </>
  );
}

import React, { useContext } from 'react';
import {
  Navbar,
  Nav,
  Container,
  Button,
  Row,
  Col,
  Card,
} from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';

const Jobs = () => {
  const cardData = [
    {
      title: 'Jobs',
      subtitle: 'Explore Diverse Careers',
      bgColor: '#FFB1CC',
      link: '/#/jobs',
    },
    {
      title: 'Mentorship',
      subtitle: 'Guide Your Growth Journey',
      bgColor: '#9BC9FF',
      link: '/#/compete',
    },
    {
      title: 'Life Coaching',
      subtitle: 'Transform Your Life Path',
      bgColor: '#C8BBFF',
      link: '/#/learn',
    },
    {
      title: 'Volunteering',
      subtitle: 'Make a Meaningful Impact',
      bgColor: '#FFDD80',
      link: '/#/practice',
    },
    {
      title: 'Networking',
      subtitle: 'Build Powerful Connections',
      bgColor: '#FEC192',
      link: '/#/mentorship',
    },
    {
      title: 'Personal Prospects',
      subtitle: 'Discover Your True Potential',
      bgColor: '#9BE6C1',
      link: '/#/mentorship',
    }
  ];

  const { logout } = useContext(AuthContext);
  return (
    <Container>
      {/* navbar */}
      <Navbar bg='white' expand='lg'>
        <Navbar.Brand href='#/home'>UniEdge</Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='ml-auto'>
            {/* <Nav.Link href='#learn'>Learn</Nav.Link>
            <Nav.Link href='#practice'>Practice</Nav.Link>
            <Nav.Link href='#mentorship'>Mentorship</Nav.Link>
            <Nav.Link href='#compete'>Compete</Nav.Link>
            <Nav.Link href='#internships'>Internships</Nav.Link>
            <Nav.Link href='#jobs'>Jobs</Nav.Link> */}

            {cardData.map((card, idx) => (
              <Nav.Link href={card.link} key={idx}>
                {card.title}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
        <Button
          variant='outline-danger'
          className='ml-2'
          onClick={() => {
            logout();
            window.location.href = '/#/login';
          }}
        >
          Logout
        </Button>
      </Navbar>

      {/* content */}
      <Row>
        {/* Left Column */}
        <Col
          md={6}
          className='d-flex align-items-center justify-content-center p-4'
        >
          <div>
            <h1><strong>Empower Your Future</strong></h1>
            <p> Unlock opportunities, gain insights, and build meaningful connections. From career growth to personal development, we're here to support every step of your journey.
            </p>
          </div>
        </Col>

        {/* Right Column */}
        <Col md={6}>
          <Row>
            {cardData.map((card, idx) => (
              <Col xs={12} md={6} key={idx} className='mb-4'>
                <a href={card.link} style={{ textDecoration: 'none' }}>
                  <Card
                    style={{
                      backgroundColor: card.bgColor,
                      height: '100%',
                      transition: 'box-shadow 0.3s ease-in-out',
                    }}
                    className='hover-shadow'
                  >
                    <Card.Body>
                      <Card.Title>{card.title}</Card.Title>
                      <Card.Text>{card.subtitle}</Card.Text>
                    </Card.Body>
                  </Card>
                </a>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Jobs;

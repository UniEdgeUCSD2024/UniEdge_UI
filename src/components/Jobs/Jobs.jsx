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
      title: 'Internship',
      subtitle: 'Gain Practical Experience',
      bgColor: '#9BE6C1',
      link: '/#/internship',
    },
    {
      title: 'Jobs',
      subtitle: 'Explore Diverse Careers',
      bgColor: '#FFB1CC',
      link: '/#/jobs',
    },
    {
      title: 'Compete',
      subtitle: 'Battle For Excellence',
      bgColor: '#9BC9FF',
      link: '/#/compete',
    },
    {
      title: 'Learn',
      subtitle: 'Expand Knowledge Base',
      bgColor: '#C8BBFF',
      link: '/#/learn',
    },
    {
      title: 'Practice',
      subtitle: 'Refine Skills Daily',
      bgColor: '#FFDD80',
      link: '/#/practice',
    },
    {
      title: 'Mentorship',
      subtitle: 'Guidance From Top Mentors',
      bgColor: '#FEC192',
      link: '/#/mentorship',
    },
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
            <h1>Unlock Your Career</h1>
            <p>
              Explore opportunities from across the globe to learn, showcase
              skills, gain CV points & get hired by your dream company.
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

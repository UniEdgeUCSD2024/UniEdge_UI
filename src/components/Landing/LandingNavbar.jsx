import React, { useState } from 'react';
import { Button, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const [, setSearchParams] = useSearchParams();

  function setService(service) {
    setSearchParams((prev) => ({
      ...Object.fromEntries(prev),
      service,
    }));
  }

  function removeService() {
    setSearchParams((prev) => {
      const { service, ...rest } = Object.fromEntries(prev);
      return rest;
    });
  }

  const navigate = useNavigate();

  return (
    <Navbar bg='transparent' expand='md'>
      <Container>
        <Navbar.Brand
          onClick={(e) => {
            e.preventDefault();
            removeService();
            navigate('/');
          }}
        >
          UniEdge
        </Navbar.Brand>
        <Navbar.Toggle onClick={toggle} />
        <Navbar.Collapse in={isOpen}>
          <Nav className='ms-auto align-items-center'>
            <NavDropdown title='Services' id='services-dropdown'>
              <NavDropdown.Item
                onClick={() => setService('professional-prospects')}
              >
                Professional Prospects
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => setService('personal-prospects')}
              >
                Personal Prospects
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => setService('mentoring')}>
                Mentoring
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => setService('life-coaching')}>
                Life Coaching
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => setService('volunteering')}>
                Volunteering
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href='#/jobs/poster'>
              <Button variant='info'>Post a Job</Button>
            </Nav.Link>
            <Nav.Link href='#/login'>
              <Button variant='primary'>Login</Button>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

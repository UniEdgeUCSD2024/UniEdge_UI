import React, { useContext, useEffect, useState } from 'react';
import { Button, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function JobsNavbar() {
  const navigate = useNavigate();
  const [scrolling, setScrolling] = useState(false);
  const { userKeys } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 99);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    window.localStorage.clear();
    navigate('/');
  };

  return (
    <Navbar
      fixed='top'
      expand='lg'
      className={scrolling ? 'bg-white' : 'navbar-transparent'}
    >
      <Container>
        <Navbar.Brand as={Link} to='/home'>
          <span>UniEdge</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse
          id='basic-navbar-nav'
          className='justify-content-end w-100'
        >
          <Nav className='ms-auto'>
            {/* <Nav.Link
              as={Button}
              variant='link'
              onClick={() => navigate('/internships')}
            >
              <i className='tim-icons icon-zoom-split' /> Jobs
            </Nav.Link> */}
            <Nav.Link
              as={Button}
              variant='link'
              onClick={() => navigate('/home')}
            >
              Home
            </Nav.Link>
            <NavDropdown
              title={
                <span>
                  <i className='tim-icons icon-single-02 me-2' />
                  {userKeys?.username || userKeys?.email || 'Guest'}{' '}
                </span>
              }
              id='basic-nav-dropdown'
              align='end'
            >
              <NavDropdown.Item as={Link} to='/mentorship/mentor/profile'>
                <i className='tim-icons icon-badge' /> Profile
              </NavDropdown.Item>
              <NavDropdown.Item as='button' onClick={handleLogout}>
                <i className='tim-icons icon-badge' /> Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

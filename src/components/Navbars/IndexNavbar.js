import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import { AuthContext, useAuth } from '../../context/AuthContext';

export default function IndexNavbar() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [navbarBg, setNavbarBg] = useState('transparent');
  const { logout } = useAuth();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const changeNavbarBg = () => {
      if (window.scrollY > 99) {
        setNavbarBg('bg-info');
      } else {
        setNavbarBg('transparent');
      }
    };

    window.addEventListener('scroll', changeNavbarBg);
    return () => window.removeEventListener('scroll', changeNavbarBg);
  }, []);

  const handleToggle = () => setExpanded(!expanded);
  const closeNav = () => setExpanded(false);

  return (
    <Navbar
      expand='lg'
      fixed='top'
      bg={navbarBg === 'transparent' ? 'transparent' : 'info'}
      expanded={expanded}
      onToggle={handleToggle}
      collapseOnSelect
    >
      <Container>
        <Navbar.Brand as={Link} to='/'>
          UniEdge
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse className='justify-content-end'>
          <Nav>
            {/* Example of how to add additional nav items */}
            {/* <Nav.Link onClick={() => navigate('/internships')}>Internships</Nav.Link>
            <Nav.Link onClick={() => navigate('/services')}>Services</Nav.Link> */}

            <NavDropdown title='Getting started' id='basic-nav-dropdown'>
              <NavDropdown.Item as={Link} to='/login' onClick={closeNav}>
                Login
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to='/register' onClick={closeNav}>
                Register
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

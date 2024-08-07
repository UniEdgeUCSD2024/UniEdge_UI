import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Button,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
  UncontrolledDropdown,
} from 'reactstrap';

export default function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const [, setSerachParams] = useSearchParams();

  function setService(service) {
    setSerachParams((prev) => ({
      ...Object.fromEntries(prev),
      service,
    }));
  }

  function removeService() {
    setSerachParams((prev) => {
      const { service, ...rest } = Object.fromEntries(prev);
      return rest;
    });
  }

  const navigate = useNavigate();

  return (
    <Navbar color='transparent' container expand='md'>
      <NavbarBrand
        onClick={(e) => {
          e.preventDefault();
          removeService();
          navigate('/');
        }}
      >
        UniEdge
      </NavbarBrand>
      <NavbarToggler onClick={toggle} />
      {/* links */}
      {/* To the right have 5 buttons (Home, About Us, Services, Resources, Signup/Login), Sign-up/Login should be highlighted */}
      <Collapse navbar>
        <Nav navbar className='ml-auto align-items-center'>
          <NavItem>
            <NavLink
              onClick={(e) => {
                e.preventDefault();
                removeService();
                navigate('/');
              }}
            >
              Home
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href='#'>About Us</NavLink>
          </NavItem>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              Services
            </DropdownToggle>
            <DropdownMenu>
              {/*  (Professional Prospects, Personal Prospects, Mentoring, Life Coaching, Volunteering) */}
              <DropdownItem
                onClick={() => setService('professional-prospects')}
              >
                Professional Prospects
              </DropdownItem>
              <DropdownItem onClick={() => setService('personal-prospects')}>
                Personal Prospects
              </DropdownItem>
              <DropdownItem onClick={() => setService('mentoring')}>
                Mentoring
              </DropdownItem>
              <DropdownItem onClick={() => setService('life-coaching')}>
                Life Coaching
              </DropdownItem>
              <DropdownItem onClick={() => setService('volunteering')}>
                Volunteering
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <NavItem>
            <NavLink href='#'>Resources</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href='#/login'>
              <Button color='primary'>Login</Button>
            </NavLink>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  );
}

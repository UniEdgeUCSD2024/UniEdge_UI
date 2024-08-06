import React, { useState } from 'react';
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

  return (
    <Navbar color='transparent' container expand='md'>
      <NavbarBrand>UNIEDGE</NavbarBrand>
      <NavbarToggler onClick={toggle} />
      {/* links */}
      {/* To the right have 5 buttons (Home, About Us, Services, Resources, Signup/Login), Sign-up/Login should be highlighted */}
      <Collapse navbar>
        <Nav navbar className='ml-auto align-items-center'>
          <NavItem>
            <NavLink href='#'>Home</NavLink>
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
              <DropdownItem>Professional Prospects</DropdownItem>
              <DropdownItem>Personal Prospects</DropdownItem>
              <DropdownItem>Mentoring</DropdownItem>
              <DropdownItem>Life Coaching</DropdownItem>
              <DropdownItem>Volunteering</DropdownItem>
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

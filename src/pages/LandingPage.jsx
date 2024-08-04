import React from 'react';
import OriginalHome from '../components/OriginalHome';
import {
  Collapse,
  Container,
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
  NavLink,
} from 'reactstrap';
import LandingNavbar from '../components/Landing/LandingNavbar';

const LandingPage = () => {
  React.useEffect(() => {
    document.body.classList.toggle('index-page');
    return function cleanup() {
      document.body.classList.toggle('index-page');
    };
  }, []);

  return (
    <>
      <div className='wrapper landing-page'>
        <LandingNavbar />
        <OriginalHome />
      </div>
    </>
  );
};
export default LandingPage;

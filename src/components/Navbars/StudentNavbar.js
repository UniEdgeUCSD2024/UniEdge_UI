import React, { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  NavbarBrand,
  Navbar,
  NavItem,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";
import { AuthContext, useAuth } from "../../context/AuthContext";

export default function StudentNavbar() {
  let navigate = useNavigate();
  const [collapseOpen, setCollapseOpen] = React.useState(false);
  const [collapseOut, setCollapseOut] = React.useState("");
  const [color, setColor] = React.useState("navbar-transparent");
  const { logout } = useAuth();
  const { currentUser } = useContext(AuthContext);
  const { userKeys } = useContext(AuthContext);

  React.useEffect(() => {
    window.addEventListener("scroll", changeColor);
    return function cleanup() {
      window.removeEventListener("scroll", changeColor);
    };
  }, []);
  const changeColor = () => {
    if (
      document.documentElement.scrollTop > 99 ||
      document.body.scrollTop > 99
    ) {
      setColor("bg-info");
    } else if (
      document.documentElement.scrollTop < 100 ||
      document.body.scrollTop < 100
    ) {
      setColor("navbar-transparent");
    }
  };
  const toggleCollapse = () => {
    document.documentElement.classList.toggle("nav-open");
    setCollapseOpen(!collapseOpen);
  };
  const onCollapseExiting = () => {
    setCollapseOut("collapsing-out");
  };
  const onCollapseExited = () => {
    setCollapseOut("");
  };
  return (
    <Navbar className={"fixed-top " + color} color-on-scroll="100" expand="lg">
      <Container>
        <div className="navbar-translate">
          <NavbarBrand to="/student" tag={Link} id="navbar-brand">
            <span style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>UniEdge</span>
          </NavbarBrand>
          {/* <UncontrolledTooltip placement="bottom" target="navbar-brand">
            Designed and Coded by Creative Tim
          </UncontrolledTooltip> */}
          <button
            aria-expanded={collapseOpen}
            className="navbar-toggler navbar-toggler"
            onClick={toggleCollapse}
          >
            <span className="navbar-toggler-bar bar1" />
            <span className="navbar-toggler-bar bar2" />
            <span className="navbar-toggler-bar bar3" />
          </button>
        </div>
        <Collapse
          className={"justify-content-end " + collapseOut}
          navbar
          isOpen={collapseOpen}
          onExiting={onCollapseExiting}
          onExited={onCollapseExited}
        >
          <div className="navbar-collapse-header">
            <Row>
              <Col className="collapse-brand" xs="6">
                <a href="#pablo" onClick={(e) => e.preventDefault()}>
                  UniEdge
                </a>
              </Col>
              <Col className="collapse-close text-right" xs="6">
                <button
                  aria-expanded={collapseOpen}
                  className="navbar-toggler"
                  onClick={toggleCollapse}
                >
                  <i className="tim-icons icon-simple-remove" />
                </button>
              </Col>
            </Row>
          </div>
          <Nav navbar>
            <NavItem>
              <Button
                className="nav-link d-none d-lg-block"
                color="default"
                onClick={() => navigate("/internships")}
              >
                <i className="tim-icons icon-zoom-split" /> Internships
              </Button>
            </NavItem>
            <NavItem>
              <Button
                className="nav-link d-none d-lg-block"
                color="default"
                onClick={() => navigate("/services")}
              >
                <i className="tim-icons icon-single-02" /> Services
              </Button>
            </NavItem>
            <NavItem>
            <UncontrolledDropdown nav>
                  <DropdownToggle
                    caret
                    color="default"
                    data-toggle="dropdown"
                    href="#pablo"
                    nav
                    onClick={(e) => e.preventDefault()}
                  >
                    
                    <i className="fa fa-cogs d-lg-none d-xl-none" />
                    Hi {userKeys ? userKeys.username : ""} !
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-with-icons" style={{ backgroundColor: "#171941" }}>
                    <DropdownItem tag={Link} to="/">
                      <i className="tim-icons icon-badge" />
                      Logout
                    </DropdownItem>
                    <DropdownItem tag={Link} to="/studentprofile">
                      <i className="tim-icons icon-badge" />
                      Profile
                    </DropdownItem>
                  </DropdownMenu>
              </UncontrolledDropdown> 
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
}

import React from "react";
import { Container, Row, Col, Button } from "reactstrap";
import Footer from "./Footer/Footer";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardTitle, CardText } from "reactstrap";


export default function OriginalHome() {
  const navigate = useNavigate();


  return (
    <>
      <div className="wrapper">
        <section className="section section-lg section-safe">
          <Container>
            <Row className="row-grid justify-content-between">
              <Col md="5">
                <div className="content-center brand" style={{ marginTop: '5rem' }}>
                  <h2 className="title">Ignite transformation and growth with the perfect connections.</h2>
                  <h4 className="description">
                  Embark on your next adventure with the ideal match. Together, we build lasting relationships, whether for a career, mentoring, or partnering. Find your perfect connection with us</h4>
                  <Button
                    color="success"
                    onClick={() => navigate("/register")}
                  >New User? Register</Button>
                                    <Button
                    color="primary"
                    onClick={() => navigate("/login")}
                  >Existing User? Login</Button>
                </div>
              </Col>
              <Col md="6">
                {/* First page picture */}
                {/* <CoverPicture /> */}
              </Col>
            </Row>
          </Container>
        </section>
        <section className="section section-lg">
          <Container>
            <Row className="justify-content-center">
              <Col lg="12">
                <h1 className="text-center mb-4">Our Services</h1>

                <Row>
                <Col md="4">
                    <Card className="card-plain">
                      <CardBody>
                        <CardTitle tag="h2" className="text-bold title">LINK UP VOLUNTEERING</CardTitle>
                        <CardText>
                        Connects students with organizations to unlock volunteer opportunities. Enhance skills and networks while organizations gain fresh, energetic contributions, strengthening communities and fostering future leaders.</CardText>
                        <Button className="btn-round" color="success"
                        onClick={() => navigate("/volunteer")}
                        >Learn More</Button> {/* Changed color to success */}
                      </CardBody>
                    </Card>
                  </Col>
                  <Col md="4">
                    <Card className="card-plain">
                      <CardBody>
                        <CardTitle tag="h2" className="text-bold title">UNIEDGE</CardTitle>
                        <CardText>
                        Engage with top recruiters and explore exciting opportunities. Whether a recent graduate or seasoned professional, we'll connect you with companies that value your skills and aspirations.
                        </CardText>
                        <Button className="btn-round" color="primary" 
                        onClick={() => navigate("/uniedge")}
                        >Learn More</Button>
                      </CardBody>
                    </Card>
                  </Col>

                  <Col md="4">
                    <Card className="card-plain">
                      <CardBody>
                        <CardTitle tag="h2" className="text-bold title">MENTORING</CardTitle>
                        <CardText>
                          Discover the ideal investors and mentors to propel your organization's success. Our platform connects organizations with industry experts who share your vision and can help you realize the full potential of your ideas.                        </CardText>
                        <Button className="btn-round" color="success" onClick={() => navigate("/mentoringlanding")}>Learn More</Button> {/* Changed color to success */}
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </section>
        <Footer />
      </div>
    </>
  );
}

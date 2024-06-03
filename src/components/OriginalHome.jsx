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
                  <h2 className="title">You spark change and growth through the right matches.</h2>
                  <h4 className="description">
                    Your next big adventure starts with the right match. Let's find it together. We're not just matching; we're building relationships that last. Discover your perfect match – whether it's for a career, a startup, or love.
                  </h4>
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
                        Links students with organizations to unlock volunteer opportunities. This platform allows students to enhance their skills and networks, while organizations benefit from fresh, energetic contributions, strengthening communities and fostering future leaders.</CardText>
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
                          Connect with top recruiters and discover exciting opportunities. Whether you're a fresh graduate or an experienced professional, we'll match you with companies that value your skills and aspirations.
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
                        <CardTitle tag="h2" className="text-bold title"> FUEL STARTUP</CardTitle>
                        <CardText>
                          Find the perfect investors and mentors to propel your startup to success. Our platform connects innovative startups with Y Combinator-like programs and experienced investors who share your vision.
                        </CardText>
                        <Button className="btn-round" color="success">Learn More</Button> {/* Changed color to success */}
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

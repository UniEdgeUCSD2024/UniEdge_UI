import React, { useState } from "react";
import { Container, Row, Button, Col, Card, Form, Input, CardHeader, CardBody, CardTitle, Label, CardFooter} from "reactstrap";


function VolunteerForm() {
  const [displayForm, setDisplayForm] = useState(false);

  return(
    <>
        <div className="wrapper">
        <section className="section section-safe">
            <Container>
            <Row className="row-grid justify-content-between">
              <Col>
                <div className="content-center brand" style={{ marginTop: '5rem' }}>
                  <h2 className="title">Join Our Community of Changemakers!</h2>
                  <h3>Connect with opportunities to volunteer and make a difference in Tech, Data, and Product roles</h3>
                  <h4 className="description">
                  Step into a world where volunteering meets innovation. At UNIEDGE, we believe in the power of tech, data, and product management to transform communities. 
                  Volunteering isn't just about giving back—it's also a unique opportunity to gain hands-on experience, collaborate with industry peers, and develop skills that are crucial in today's digital world. 
                  Whether you're helping a startup optimize their data, designing tech solutions for non-profits, or managing product launches for social enterprises, you're making a real impact while enhancing your professional journey. 
                  Connect with remote and on-site roles that cater to your skills and interests, and become part of the next wave of change.
                  </h4>
                  {
                    !displayForm?<Button
                    color="info"
                    onClick={() => setDisplayForm(true)}
                  >Sign Up to Volunteer</Button>:<></>
                  }
                  
                </div>
              </Col>
            </Row>
            {
                displayForm?
                <Row className="row-grid justify-content-between" >
                    <hr></hr>
                    <hr></hr>
                <Card >
                    <CardHeader>
                        
                      <CardTitle tag="h3">Volunteer Form</CardTitle>
                    </CardHeader>
                    <CardBody>
                <Form className="form">
                    <Container>
                        <Row>
                            <Col>
                            <Input
                          placeholder="First Name"
                          type="text"
                        />
                        <Input
                          style={{ marginTop: "1rem" }}
                          placeholder="Email Address"
                          type="text"
                        />
                        <Input
                          style={{ marginTop: "1rem" }}
                          placeholder="Field of Study"
                          type="text"
                        />
                            </Col>
                            <Col>
                            <Input
                          placeholder="Last Name"
                          type="text"
                        />
                        <Input
                          style={{ marginTop: "1rem" }}
                          placeholder="University/College"
                          type="text"
                        />
                        <Input
                          style={{ marginTop: "1rem" }}
                          placeholder="Interested Roles"
                          type="text"
                        />
                            </Col>

                        </Row>
                        <hr></hr>
                        <Row>
                        <Label check
                         style={{ marginLeft: "1rem" }}
                        >
                              <Input type="checkbox" />
                              <span className="form-check-sign" />I agree to receive communications about volunteering opportunities and other related information.
                            </Label>

                        </Row>
                    </Container>

                      </Form>
                      </CardBody>
                      <CardFooter style={{justifyItems: "center"}}>
                        <Button
                          className="btn-round"
                          color="success"
                          size="lg"
                        >
                          Sign Up
                        </Button>
                      </CardFooter>
                </Card>
                </Row> : <></>
              }
          </Container>
            </section>
        </div>
    </>
  )
}

export default VolunteerForm;

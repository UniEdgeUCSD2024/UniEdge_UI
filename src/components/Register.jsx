import React, { useRef, useState } from "react";
import {
  Form,
  Button,
  Card,
  Alert,
  Container,
  Row,
  Col,
  Input,
  Label,
  CardHeader,
  CardImg,
  CardBody,
  CardTitle,
  FormGroup,
  CardFooter,
} from "reactstrap";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function UserSignup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup, currentUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      history("/home");
    } catch (error) {
      console.log(error)
      setError("Failed to create an account");
    }

    setLoading(false);
  }

  return (
    <>
      <>
        <div className="wrapper">
          <div className="page-header">
            <div className="content">
              <Container>
                <Row>
                  <Col className="offset-lg-0 offset-md-3" lg="5" md="6">
                    <Card className="card-register">
                      <CardHeader>
                        <CardImg
                          alt="..."
                          src={require("../assets/img/square1.png")}
                        />
                        <CardTitle tag="h3">Register</CardTitle>
                      </CardHeader>
                      <CardBody>
                        {error && (
                          <Alert
                            variant="danger"
                            style={{ backgroundColor: "red" }}
                          >
                            {error}
                          </Alert>
                        )}
                        <Form className="form" onSubmit={handleSubmit}>
                          <Input
                            innerRef={emailRef}
                            placeholder="Email"
                            type="text"
                          />
                          <Input
                            style={{ marginTop: "1rem" }}
                            innerRef={passwordRef}
                            placeholder="Password"
                            type="password"
                          />
                          <Input
                            style={{ marginTop: "1rem" }}
                            innerRef={passwordConfirmRef}
                            placeholder="Confirm Password"
                            type="password"
                          />
                          <FormGroup check className="form-check-radio">
                            <Label check>
                              <Input defaultValue="student" name="role" type="radio" />
                              <span className="form-check-sign" />Student
                            </Label>
                          </FormGroup>
                          <FormGroup check className="form-check-radio">
                            <Label check>
                              <Input defaultValue="recruiter" name="role" type="radio" />
                              <span className="form-check-sign" />Recruiter
                            </Label>
                          </FormGroup>
                          <FormGroup check className="text-left">
                            <Label check>
                              <Input type="checkbox" />
                              <span className="form-check-sign" />I agree to the{" "}
                              <a
                                href="#pablo"
                                onClick={(e) => e.preventDefault()}
                              >
                                terms and conditions
                              </a>
                              .
                            </Label>
                          </FormGroup>
                        </Form>
                      </CardBody>
                      <CardFooter>
                        <Button
                          disabled={loading}
                          className="btn-round"
                          color="info"
                          size="lg"
                          onClick={handleSubmit}
                        >
                          Sign Up
                        </Button>
                      </CardFooter>
                    </Card>
                    <div className="text-center">
                      Already have an account? <Link to="/login">Log In</Link>
                    </div>
                  </Col>
                  <Col>
                    {/* <img
                      width={"60%"}
                      style={{ float: "right" }}
                      alt="..."
                      className="img-fluid"
                      src={require("../assets/img/field.png")}
                    /> */}
                  </Col>
                </Row>
              </Container>
            </div>
          </div>
        </div>
      </>
    </>
  );
}

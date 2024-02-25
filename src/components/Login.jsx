import React, { useContext, useRef, useState } from "react";
import {
  Form,
  Button,
  Card,
  Alert,
  Container,
  Row,
  Col,
  Input,
  CardHeader,
  CardImg,
  CardBody,
  CardTitle,
  CardFooter,
} from "reactstrap";
import { useAuth, AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useNavigate();
  const { userKeys } = useContext(AuthContext);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      if (userKeys && userKeys.role) {
        if (userKeys.role === 'Student') {
          history("/student");
        } else {
          history("/RecruiterHomePage");
        }
        const response = await fetch('https://uniedge-functions.azurewebsites.net/checkuser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userKeys.email,
            role: userKeys.role,
          }),
        });      
        const login_state = await response.json(); 
        if (login_state) {
          updateLoginState(login_state)
          console.log(login_state + "loginpage")
        }
      } else {
        setError("User keys not found or invalid");
      }
    } catch (error) {
      console.error(error);
      setError("Failed to log in");
    }
    setLoading(false);
  }  

  function updateLoginState(loginState) {
    window.localStorage.setItem('login_state', JSON.stringify(loginState));
    window.dispatchEvent(new Event('loginStateUpdated'));
}

  return (
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
                      <CardTitle tag="h3">Login</CardTitle>
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
                      <Form className="form">
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
                        Login
                      </Button>
                    </CardFooter>
                  </Card>
                  <div className="text-center">
                    <Link to="/forgot-password">Forgot Password?</Link>
                  </div>
                  <div className="w-100 text-center mt-2">
                    Need an account? <Link to="/register">Sign Up</Link>
                  </div>
                </Col>
                <Col>
                  {/* <img
                    width={"60%"}
                    style={{ float: "right" }}
                    alt="..."
                    className="img-fluid"
                    src={require("../assets/img/peel.png")}
                  /> */}
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
    </>
  );
}

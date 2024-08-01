import React from "react";
import { Container, Row, Col, Button } from "reactstrap";
import Footer from "./Footer/Footer";
import { useNavigate } from "react-router-dom";


export default function MentoringHome() {
  const navigate = useNavigate();


  return (
    <>
      <div className="wrapper">
        <section className="section section-lg section-safe">
                    <Container>
            <Row className="row-grid justify-content-between">
              <Col md="5">
              <div className="content-center brand" style={{marginTop: '5rem'}}>
              <h2 className="title">Bridging the Gap Between Mentees and Mentors</h2>
            <h4 className="description">
            Our platform is designed to empower mentees and mentors, providing an optimal matchmaking experience that significantly enhances the learning and growth journey for mentees while enabling mentors to discover individuals who align with their expertise and guidance.</h4>
              <Button
                        color="success"
                        onClick={()=>navigate("/mentorregister")}
                      >Register with us</Button>
            </div>
              </Col>
              <Col md="6">
                {/* First page picture */}
                {/* <CoverPicture /> */} 
              </Col>
            </Row>
          </Container>
        </section>
        <Footer />
      </div>
    </>
  );
}

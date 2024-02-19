import React, { useContext, useRef, useState } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";
import { AuthContext, useAuth } from "../../context/AuthContext";


export default function StudentHome() {
  const navigate = useNavigate();
  const { userKeys } = useContext(AuthContext);


  return (
    <>
      <div className="wrapper">
        <section className="section section-lg section-safe">
                    <Container>
            <Row className="row-grid justify-content-between">
              <Col md="5">
              <div className="content-center brand" style={{marginTop: '5rem'}}>
              <h2 className="title">Empowering Your Job Hunt Journey</h2>
            <h4 className="description">
            Hey { userKeys ? userKeys.userName : ""}, UniEdge understands the challenges university students face in today's competitive job market. That's why we're dedicated to supporting your career ambitions. 
            Explore our tailored job search services, leverage curated coaching, and gain an edge with UniEdge. Let's navigate this journey together and unlock the doors to your professional future.
            </h4>
            <Button
                        color="info"
                        onClick={()=>navigate("/internships")}
                      >Explore the Internships</Button>
              <Button
                        color="success"
                        onClick={()=>navigate("/services")}
                      >Gain Edge with our Services</Button>
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
                <h1 className="text-center" style={{ marginBottom: "-5%" }}>
                  Our Services
                </h1>
                <Row className="row-grid justify-content-center">
                  <Col lg="3" className="text-center">
                    <div className="info">
                      <div className="icon icon-warning">
                        <i className="tim-icons icon-link-72" />
                      </div>
                      <h4 className="info-title">Internship Listings</h4>
                      <p>Find the Latest Internship Listings</p>
                    </div>
                  </Col>
                  <Col lg="3" className="text-center">
                    <div className="info">
                      <div className="icon icon-danger">
                        <i className="tim-icons icon-lock-circle" />
                      </div>
                      <h4 className="info-title">Precision Match</h4>
                      <p>Your Compatibility Compass</p>
                    </div>
                  </Col>
                  <Col lg="3" className="text-center">
                    <div className="info">
                      <div className="icon icon-primary">
                        <i className="tim-icons icon-chart-pie-36" />
                      </div>
                      <h4 className="info-title">Curated Coaching</h4>
                      <p>Customized Coaching for Career Success</p>
                    </div>
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

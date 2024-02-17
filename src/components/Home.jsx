import React from "react";
import { Container, Row, Col, Button } from "reactstrap";
import Footer from "./Footer/Footer";
import { useNavigate } from "react-router-dom";


export default function Home() {
  const navigate = useNavigate();


  return (
    <>
      <div className="wrapper">
        <section className="section section-lg section-safe">
                    <Container>
            <Row className="row-grid justify-content-between">
              <Col md="5">
              <div className="content-center brand" style={{marginTop: '5rem'}}>
              <h2 className="title">A Blockchain-Based Food Supply Chain Application built on
                Resilient DB</h2>
            <h4 className="description">
            Revolutionizing traceability with blockchain integration, empowering industries 
                through transparent supply chain tracking, and pioneering sustainable innovation by reclaiming 
                and transforming by-products for a brighter, eco-conscious future.
            </h4>
            <Button
                        color="info"
                        onClick={()=>navigate("/track")}
                      >Explore the Sample</Button>
              <Button
                        color="success"
                        onClick={()=>navigate("/register")}
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
        <section className="section section-lg">
          <Container>
            <Row className="justify-content-center">
              <Col lg="12">
                <h1 className="text-center" style={{ marginBottom: "-5%" }}>
                  Why Arrayán?
                </h1>
                <Row className="row-grid justify-content-center">
                  <Col lg="3" className="text-center">
                    <div className="info">
                      <div className="icon icon-warning">
                        <i className="tim-icons icon-link-72" />
                      </div>
                      <h4 className="info-title">Preserve food safety</h4>
                    </div>
                  </Col>
                  <Col lg="3" className="text-center">
                    <div className="info">
                      <div className="icon icon-danger">
                        <i className="tim-icons icon-lock-circle" />
                      </div>
                      <h4 className="info-title">Enhance Food security</h4>
                    </div>
                  </Col>
                  <Col lg="3" className="text-center">
                    <div className="info">
                      <div className="icon icon-primary">
                        <i className="tim-icons icon-chart-pie-36" />
                      </div>
                      <h4 className="info-title">Reduce food wastage</h4>
                    </div>
                  </Col>
                  <Col lg="3" className="text-center">
                    <div className="info">
                      <div className="icon icon-success">
                        <i className="tim-icons icon-spaceship" />
                      </div>
                      <h4 className="info-title">
                        Boost the valorization of by-products
                      </h4>
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

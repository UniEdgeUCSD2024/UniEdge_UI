import React from "react";
import {
  Button,
  Container,
  Row,
  Col,
} from "reactstrap";

export default function Footer() {
  return (
    <footer className="footer">
      <Container>
        <Row>
          
          <Col>
            <h3 className="title">Visit Our Repository:</h3>
            <div className="btn-wrapper profile">
              <Button
                className="btn-icon btn-neutral btn-round btn-simple"
                color="default"
                href="https://github.com/UniEdgeUCSD2024/uniedge"
                id="tooltip622135962"
                target="_blank"
              >
                <i className="fab fa-github" />
              </Button>
            </div>
          </Col>
          <Col className="text-center">
           <p style={{marginTop: '20%'}}>Built on Cosmos DB</p> 
          </Col>
          <Col className="text-center">
           <p style={{marginTop: '20%'}}>© 2024 UniEdge. All Rights Reserved.</p> 
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

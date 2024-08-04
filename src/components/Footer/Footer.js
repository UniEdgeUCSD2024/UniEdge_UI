import React from 'react';
import { Button, Container, Row, Col } from 'reactstrap';

export default function Footer() {
  return (
    <footer className='footer'>
      <Container>
        <h4 className='text-center mx-1 font-weight-bold'>Get In Touch</h4>
        <div className='text-center d-flex justify-content-center align-items-center'>
          <div className='mx-1'>
            {/* follow us on - linkedin */}
            <Button
              className='btn-icon btn-round btn-simple btn-lg mx-1 btn-neutral'
              color='default'
              target='_blank'
            >
              <i className='fab fa-linkedin fa-2x' />
            </Button>
          </div>
          {/* contact us (email) */}
          <div className='mx-1'>
            <Button
              color='default'
              target='_blank'
              className='btn-icon btn-round btn-simple btn-lg mx-1 btn-neutral'
            >
              <i className='fas fa-envelope' />
            </Button>
          </div>
        </div>
        <div className='text-center py-4'>
          <p>© 2024 UniEdge. All Rights Reserved.</p>
        </div>
      </Container>
    </footer>
  );
}

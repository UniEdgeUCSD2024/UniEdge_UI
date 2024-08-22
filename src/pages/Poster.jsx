import React, { useState } from 'react';
import {
  Button,
  Container,
  Form,
  Nav,
  Navbar,
  Row,
  Col,
  Badge,
  Image,
  Card,
} from 'react-bootstrap';

function JobPostingForm() {
  const [skills, setSkills] = useState([]);
  const [input, setInput] = useState('');

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (input.trim() && !skills.includes(input.trim())) {
      setSkills([...skills, input.trim()]);
    }
    setInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div>
      <Navbar expand='lg'>
        <Container>
          <Navbar.Brand href='#/home'>UniEdge</Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              <Nav.Link href='#home'>Home</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Background image with Overlay */}
      {/* <div
        className='bg-image text-center py-5'
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1,
          }}
        ></div>
        <div className='text-white' style={{ position: 'relative', zIndex: 2 }}>
          <h1>Find the Perfect Candidate</h1>
          <p className='text-white-50'>
            Fill in the details below to post a job and attract top talent.
          </p>
        </div>
      </div> */}

      <div className='text-center py-4' style={{ backgroundColor: '#f8f9fa' }}>
        {/* <Image
          src='https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          fluid
          rounded
          alt='Post Your Job'
          className='mb-3'
          width={300}
        /> */}
        {/* <h1>Find the Perfect Candidate</h1> */}
        <h1>Post a Job</h1>
        <p className='text-muted'>
          Fill in the details below to post a job and attract top talent.
        </p>
      </div>

      {/* Main Form Section */}
      <div className='p-4' style={{ maxWidth: '600px', margin: '20px auto' }}>
        <Card className='p-4'>
          <Form>
            {/* Company */}
            <Form.Group className='mb-3' controlId='formCompany'>
              <Form.Label>Company</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter company name'
                required
                autoFocus
              />
            </Form.Group>

            {/* Job/Role Title */}
            <Form.Group className='mb-3' controlId='formJobTitle'>
              <Form.Label>Job/Role Title</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter job or role title'
                required
              />
            </Form.Group>

            {/* Category */}
            <Form.Group className='mb-3' controlId='formCategory'>
              <Form.Label>Category</Form.Label>
              <Form.Control as='select' required>
                <option>Select category</option>
                <option>Business Analyst</option>
                <option>Data Analyst</option>
                <option>Data Scientist</option>
                <option>Product Manager</option>
                <option>Project Management</option>
                <option>Consultant</option>
                <option>Internship</option>
                <option>Others</option>
              </Form.Control>
            </Form.Group>

            {/* Skills */}
            <Form.Group className='mb-3' controlId='formSkills'>
              <Form.Label>Skills</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter a skill and press enter'
                value={input}
                onChange={(e) => {
                  // if last entered is comma
                  const lastChar = e.target.value.slice(-1);
                  if (lastChar === ',') {
                    handleAddSkill(e);
                  } else setInput(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleAddSkill(e);
                }}
              />
              <div className='mt-2'>
                {skills.map((skill, index) => (
                  <Badge
                    key={index}
                    pill
                    bg='primary'
                    className='me-2 mb-2'
                    style={{ cursor: 'pointer', fontSize: '1rem' }}
                    onClick={() => handleRemoveSkill(skill)}
                  >
                    {skill} &times;
                  </Badge>
                ))}
              </div>
            </Form.Group>

            {/* Job/Role Description */}
            <Form.Group className='mb-3' controlId='formJobDescription'>
              <Form.Label>Job/Role Description</Form.Label>
              <Form.Control
                as='textarea'
                rows={4}
                placeholder='Enter job or role description'
                required
              />
            </Form.Group>

            {/* Required Qualifications */}
            <Form.Group className='mb-3' controlId='formRequiredQualifications'>
              <Form.Label>Required Qualifications</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                placeholder='Enter required qualifications'
              />
            </Form.Group>

            {/* Preferred Qualifications */}
            <Form.Group
              className='mb-3'
              controlId='formPreferredQualifications'
            >
              <Form.Label>Preferred Qualifications</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                placeholder='Enter preferred qualifications'
              />
            </Form.Group>

            {/* Pay Range */}
            <Form.Group className='mb-3' controlId='formPayRange'>
              <Form.Label>Pay Range</Form.Label>
              <Row>
                <Col>
                  <Form.Control
                    type='number'
                    placeholder='Start'
                    min='0'
                    required
                  />
                </Col>
                <Col>
                  <Form.Control
                    type='number'
                    placeholder='Max'
                    min='0'
                    required
                  />
                </Col>
              </Row>
            </Form.Group>

            {/* Submit Button */}
            <Button variant='primary' type='submit' className='w-100'>
              Post Job
            </Button>
          </Form>
        </Card>
      </div>

      {/* Footer Section */}
      <div className='text-center py-4' style={{ backgroundColor: '#f8f9fa' }}>
        <p className='text-muted'>
          UniEdge © {new Date().getFullYear()} | All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default JobPostingForm;

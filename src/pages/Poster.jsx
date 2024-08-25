import React, { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Container,
  Form,
  Nav,
  Navbar,
} from 'react-bootstrap';

function JobPostingForm() {
  const [skills, setSkills] = useState([]);
  const [input, setInput] = useState('');
  const [formData, setFormData] = useState({
    Company: '',
    'Job/Role Title': '',
    Category: '',
    City: '',
    State: '',
    'Job/Role Description': '',
    'Required Qualifications': '',
  });

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginState = JSON.parse(localStorage.getItem('login_state'));

    console.log(loginState);

    const data = {
      ...formData,
      Skills: skills,
      Source: 'Uniedge',
      Recruiter: loginState?.Id ?? 'guest', // or set to registered recruiter ID if available
    };

    try {
      const response = await fetch(
        'https://uniedge-prospect-functions.azurewebsites.net/postjob',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        alert('Your job is posted successfully!');
      } else if (response.status === 401) {
        alert('Please register to find top talent.');
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    }
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

      <div className='text-center py-4' style={{ backgroundColor: '#f8f9fa' }}>
        <h1>Post a Job</h1>
        <p className='text-muted'>
          Fill in the details below to post a job and attract top talent.
        </p>
      </div>

      <div className='p-4' style={{ maxWidth: '600px', margin: '20px auto' }}>
        <Card className='p-4'>
          <Form onSubmit={handleSubmit}>
            {/* Company */}
            <Form.Group className='mb-3' controlId='formCompany'>
              <Form.Label>Company</Form.Label>
              <Form.Control
                type='text'
                name='Company'
                placeholder='Enter company name'
                required
                value={formData['Company']}
                onChange={handleChange}
                autoFocus
              />
            </Form.Group>

            {/* Job/Role Title */}
            <Form.Group className='mb-3' controlId='formJobTitle'>
              <Form.Label>Job/Role Title</Form.Label>
              <Form.Control
                type='text'
                name='Job/Role Title'
                placeholder='Enter job or role title'
                required
                value={formData['Job/Role Title']}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Category */}
            <Form.Group className='mb-3' controlId='formCategory'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                as='select'
                name='Category'
                required
                value={formData.Category}
                onChange={handleChange}
              >
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

            {/* City */}
            <Form.Group className='mb-3' controlId='formCity'>
              <Form.Label>City</Form.Label>
              <Form.Control
                type='text'
                name='City'
                placeholder='Enter city'
                required
                value={formData['City']}
                onChange={handleChange}
              />
            </Form.Group>

            {/* State */}
            <Form.Group className='mb-3' controlId='formState'>
              <Form.Label>State</Form.Label>
              <Form.Select
                as='select'
                name='State'
                required
                value={formData.State}
                onChange={handleChange}
              >
                <option disabled>Select state</option>
                {[
                  'Alabama',
                  'Alaska',
                  'Arizona',
                  'Arkansas',
                  'California',
                  'Colorado',
                  'Connecticut',
                  'Delaware',
                  'District of Columbia',
                  'Florida',
                  'Georgia',
                  'Hawaii',
                  'Idaho',
                  'Illinois',
                  'Indiana',
                  'Iowa',
                  'Kansas',
                  'Kentucky',
                  'Louisiana',
                  'Maine',
                  'Montana',
                  'Nebraska',
                  'Nevada',
                  'New Hampshire',
                  'New Jersey',
                  'New Mexico',
                  'New York',
                  'North Carolina',
                  'North Dakota',
                  'Ohio',
                  'Oklahoma',
                  'Oregon',
                  'Maryland',
                  'Massachusetts',
                  'Michigan',
                  'Minnesota',
                  'Mississippi',
                  'Missouri',
                  'Pennsylvania',
                  'Rhode Island',
                  'South Carolina',
                  'South Dakota',
                  'Tennessee',
                  'Texas',
                  'Utah',
                  'Vermont',
                  'Virginia',
                  'Washington',
                  'West Virginia',
                  'Wisconsin',
                  'Wyoming',
                ].map((state, index) => (
                  <option key={index} value={state}>
                    {state}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Skills */}
            <Form.Group className='mb-3' controlId='formSkills'>
              <Form.Label>Skills</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter a skill and press enter'
                value={input}
                onChange={(e) => {
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
                name='Job/Role Description'
                rows={4}
                placeholder='Enter job or role description'
                required
                value={formData['Job/Role Description']}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Required Qualifications */}
            <Form.Group className='mb-3' controlId='formRequiredQualifications'>
              <Form.Label>Required Qualifications</Form.Label>
              <Form.Control
                as='textarea'
                name='Required Qualifications'
                rows={3}
                placeholder='Enter required qualifications'
                value={formData['Required Qualifications']}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Submit Button */}
            <Button variant='primary' type='submit' className='w-100'>
              Post Job
            </Button>
          </Form>
        </Card>
      </div>

      <div className='text-center py-4' style={{ backgroundColor: '#f8f9fa' }}>
        <p className='text-muted'>
          UniEdge © {new Date().getFullYear()} | All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default JobPostingForm;

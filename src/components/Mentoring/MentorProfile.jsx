import React, { useContext, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  InputGroup,
  Spinner,
  Card,
  Alert,
} from 'react-bootstrap';
import { FaMinus } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';
import { capitalize } from 'lodash';

const MentorProfile = () => {
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const { userKeys } = useContext(AuthContext);
  const parameters = useParams();

  const serviceName = capitalize(parameters.service);
  const role = capitalize(parameters.role);

  const loginState = JSON.parse(localStorage.getItem('login_state'));

  const [profile, setProfile] = useState({
    firstName: loginState.Profile.FirstName || '',
    lastName: '',
    headline: '',
    about: '',
    skills: '',
    experience: [],
    education: [],
    categories: [], // For Area of Expertise
    pricing: 50, // Default pricing value set to $50
    freeSession: 'Yes', // Default value for Free Session
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleLinkedInUrlChange = (e) => setLinkedInUrl(e.target.value);

  const handleUploadLinkedInProfile = async () => {
    if (!linkedInUrl) return;
    setLoading(true);

    try {
      setError('');
      const response = await fetch(
        'https://uniedge-prospect-functions.azurewebsites.net/linkedinprofile',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: loginState.Id,
            linkedin_profile_url: linkedInUrl,
          }),
        }
      );

      const data = await response.json();

      if (data.profile) {
        setProfile({
          firstName: data.profile.firstName || '',
          lastName: data.profile.lastName || '',
          headline: data.profile.headline || '',
          about: data.profile.about || '',
          skills: data.profile.skills ? data.profile.skills.join(', ') : '',
          experience: data.profile.experience || [],
          education: data.profile.education || [],
          categories: profile.categories, // Retain selected categories
          pricing: profile.pricing, // Retain current pricing
          freeSession: profile.freeSession, // Retain free session value
        });
      }
    } catch (error) {
      console.error('Error uploading LinkedIn profile:', error);
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e, section, index, field) => {
    const updatedSection = [...profile[section]];
    updatedSection[index][field] = e.target.value;
    setProfile({ ...profile, [section]: updatedSection });
  };

  const handleAddField = (section) => {
    const newField =
      section === 'experience'
        ? {
            title: '',
            companyName: '',
            startDate: '',
            endDate: '',
            description: '',
          }
        : {
            degreeName: '',
            fieldOfStudy: '',
            schoolName: '',
            startDate: '',
            endDate: '',
          };
    setProfile({ ...profile, [section]: [...profile[section], newField] });
  };

  const handleRemoveField = (section, index) => {
    const updatedSection = profile[section].filter((_, i) => i !== index);
    setProfile({ ...profile, [section]: updatedSection });
  };

  const handleCategoriesChange = (e) => {
    const selectedCategories = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setProfile({ ...profile, categories: selectedCategories });
  };

  const handlePricingChange = (e) => {
    setProfile({ ...profile, pricing: e.target.value });
  };

  const handleFreeSessionChange = (e) => {
    setProfile({ ...profile, freeSession: e.target.value });
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmitProfile = async () => {
    const { firstName, lastName, headline, about, skills, experience, education, categories, pricing, freeSession } = profile;

    if (!firstName || !lastName) {
      alert('Please fill in the first name and last name fields.');
      return;
    }

    setError('');
    setSubmitting(true);
    const loginState = JSON.parse(localStorage.getItem('login_state'));
    const profileDetails = {
      Id: loginState.Id,
      LastName: lastName,
      FirstName: firstName,
      Headline: headline,
      About: about,
      Skills: skills,
      Experience: experience.map((exp) => ({
        Title: exp.title,
        Company: exp.companyName,
        StartDate: exp.timePeriod?.startDate || '',
        EndDate: exp.timePeriod?.endDate || '',
        Description: exp.description,
      })),
      Education: education.map((edu) => ({
        Degree: edu.degreeName,
        FieldOfStudy: edu.fieldOfStudy,
        University: edu.schoolName,
        StartDate: edu.timePeriod?.startDate || '',
        EndDate: edu.timePeriod?.endDate || '',
      })),
      Categories: categories,
      Pricing: pricing,
      FreeSession: freeSession,
    };

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(
        'https://uniedge-prospect-functions.azurewebsites.net/adduser',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            Id: loginState.id,
            Service: serviceName,
            Role: role,
            Email: userKeys.email,
            Profile: {},
            Profile_details: profileDetails,
          }),
        }
      );

      const data = await response.json();
      localStorage.setItem('login_state', JSON.stringify(data));
      setSuccess(true);
    } catch (error) {
      console.error('Error submitting profile:', error);
      setError('Something went wrong. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className='py-5 mt-5'>
      <Row>
        <Col xs={12}>
          {error && <Alert variant='danger'>{error}</Alert>}
          {success && (
            <Alert variant='success'>
              Your profile has been successfully saved.
            </Alert>
          )}
        </Col>
        <Col xs={12} md={6}>
          <h4>Import Profile From LinkedIn</h4>
          <InputGroup className='mb-3'>
            <Form.Control
              placeholder='LinkedIn Profile URL'
              value={linkedInUrl}
              onChange={handleLinkedInUrlChange}
            />
            <Button
              variant='primary'
              onClick={handleUploadLinkedInProfile}
              disabled={loading}
            >
              {loading ? <Spinner animation='border' size='sm' /> : 'Import'}
            </Button>
          </InputGroup>
          <h4 className='mt-4'>Profile Information</h4>
          <Form className='mt-3'>
            <Form.Group controlId='formHeadline'>
              <Form.Label>Headline</Form.Label>
              <Form.Control
                type='text'
                value={profile.headline}
                onChange={(e) =>
                  setProfile({ ...profile, headline: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId='formAbout'>
              <Form.Label>About</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                value={profile.about}
                onChange={(e) =>
                  setProfile({ ...profile, about: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId='formFirstName'>
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type='text'
                value={profile.firstName}
                onChange={(e) =>
                  setProfile({ ...profile, firstName: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId='formLastName'>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type='text'
                value={profile.lastName}
                onChange={(e) =>
                  setProfile({ ...profile, lastName: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId='formSkills'>
              <Form.Label>Skills</Form.Label>
              <Form.Control
                type='text'
                value={profile.skills}
                onChange={(e) =>
                  setProfile({ ...profile, skills: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Col>
        <Col xs={12} md={6}>
          <Form.Group controlId='formCategories'>
            <Form.Label>Area of Expertise</Form.Label>
            <Form.Control
              as='select'
              multiple
              value={profile.categories}
              onChange={handleCategoriesChange}
              style={{ height: 'auto', display: 'block' }}
            >
              <option value="Career Guidance">Career Guidance</option>
              <option value="Leadership">Leadership</option>
              <option value="Technology">Technology</option>
              <option value="Entrepreneurship">Entrepreneurship</option>
              <option value="Personal Development">Personal Development</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId='formPricing'>
            <Form.Label>Pricing ($)</Form.Label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span>$0</span>
              <Form.Control
                type='range'
                min='0'
                max='100'
                value={profile.pricing}
                onChange={handlePricingChange}
                style={{ flex: 1, margin: '0 10px', background: 'linear-gradient(to right, #0d6efd, #0d6efd 50%, #dee2e6 50%)', height: '8px', borderRadius: '5px' }}
              />
              <span>$100</span>
            </div>
            <Form.Text className='text-muted'>
              {`Current: $${profile.pricing}`}
            </Form.Text>
          </Form.Group>

          <Form.Group controlId='formFreeSession'>
            <Form.Label>Free Session</Form.Label>
            <Form.Control
              as='select'
              value={profile.freeSession}
              onChange={handleFreeSessionChange}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>

      <Row className='mt-4'>
        <Col xs={12}>
          <h5>Work Experience</h5>
          {profile.experience.map((exp, index) => (
            <Card key={index} className='mb-3'>
              <Card.Header>
                <Card.Title className='align-items-center d-flex justify-content-between'>
                  Experience {index + 1}
                  <Button
                    variant='link'
                    onClick={() => handleRemoveField('experience', index)}
                    className='float-end'
                  >
                    <FaMinus />
                  </Button>
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Form.Group controlId={`formExperienceTitle${index}`}>
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type='text'
                    value={exp.title}
                    onChange={(e) =>
                      handleInputChange(e, 'experience', index, 'title')
                    }
                  />
                </Form.Group>
                <Form.Group controlId={`formExperienceCompany${index}`}>
                  <Form.Label>Company</Form.Label>
                  <Form.Control
                    type='text'
                    value={exp.companyName}
                    onChange={(e) =>
                      handleInputChange(e, 'experience', index, 'companyName')
                    }
                  />
                </Form.Group>
                <Row>
                  <Col>
                    <Form.Group controlId={`formExperienceStartDate${index}`}>
                      <Form.Label>Start Date</Form.Label>
                      <Form.Control
                        type='text'
                        value={exp.startDate}
                        onChange={(e) =>
                          handleInputChange(e, 'experience', index, 'startDate')
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId={`formExperienceEndDate${index}`}>
                      <Form.Label>End Date</Form.Label>
                      <Form.Control
                        type='text'
                        value={exp.endDate}
                        onChange={(e) =>
                          handleInputChange(e, 'experience', index, 'endDate')
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group controlId={`formExperienceDescription${index}`}>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as='textarea'
                    rows={3}
                    value={exp.description}
                    onChange={(e) =>
                      handleInputChange(e, 'experience', index, 'description')
                    }
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          ))}
          <Button
            variant='outline-primary'
            onClick={() => handleAddField('experience')}
          >
            Add Experience
          </Button>

          <h5 className='mt-4'>Education</h5>
          {profile.education.map((edu, index) => (
            <Card key={index} className='mb-3'>
              <Card.Header>
                <Card.Title className='align-items-center d-flex justify-content-between'>
                  Education {index + 1}
                  <Button
                    variant='link'
                    onClick={() => handleRemoveField('education', index)}
                    className='float-end'
                  >
                    <FaMinus />
                  </Button>
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Form.Group controlId={`formEducationDegree${index}`}>
                  <Form.Label>Degree</Form.Label>
                  <Form.Control
                    type='text'
                    value={edu.degreeName}
                    onChange={(e) =>
                      handleInputChange(e, 'education', index, 'degreeName')
                    }
                  />
                </Form.Group>
                <Form.Group controlId={`formEducationField${index}`}>
                  <Form.Label>Field of Study</Form.Label>
                  <Form.Control
                    type='text'
                    value={edu.fieldOfStudy}
                    onChange={(e) =>
                      handleInputChange(e, 'education', index, 'fieldOfStudy')
                    }
                  />
                </Form.Group>
                <Form.Group controlId={`formEducationSchool${index}`}>
                  <Form.Label>School</Form.Label>
                  <Form.Control
                    type='text'
                    value={edu.schoolName}
                    onChange={(e) =>
                      handleInputChange(e, 'education', index, 'schoolName')
                    }
                  />
                </Form.Group>
                <Row>
                  <Col>
                    <Form.Group controlId={`formEducationStartDate${index}`}>
                      <Form.Label>Start Date</Form.Label>
                      <Form.Control
                        type='text'
                        value={edu.startDate}
                        onChange={(e) =>
                          handleInputChange(e, 'education', index, 'startDate')
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId={`formEducationEndDate${index}`}>
                      <Form.Label>End Date</Form.Label>
                      <Form.Control
                        type='text'
                        value={edu.endDate}
                        onChange={(e) =>
                          handleInputChange(e, 'education', index, 'endDate')
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
          <Button
            variant='outline-primary'
            onClick={() => handleAddField('education')}
          >
            Add Education
          </Button>

          <div className='mt-4'>
            <Button
              variant='success'
              className='mt-4 text-white'
              onClick={handleSubmitProfile}
              disabled={submitting || error}
            >
              <i className='fas fa-save me-2' />
              {submitting ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default MentorProfile;

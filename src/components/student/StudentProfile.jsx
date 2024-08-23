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
const ProfileForm = () => {
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const { userKeys } = useContext(AuthContext);
  const parameters = useParams();

  const serviceName = capitalize(parameters.service);
  const role = capitalize(parameters.role);

  const loginState = JSON.parse(localStorage.getItem('login_state'));

  const [profile, setProfile] = useState({
    firstName: loginState.Profile.FirstName || '',
    lastName: '',
    experience: [],
    education: [],
    headline: '',
  });
  const [resume, setResume] = useState(null);
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
          experience: data.profile.experience || [],
          education: data.profile.education || [],
          headline: data.profile.headline || '',
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

  const handleResumeUpload = (e) => setResume(e.target.files[0]);

  const [submitting, setSubmitting] = useState(false);

  const handleSubmitProfile = async () => {
    const { firstName, lastName, experience, education, headline } = profile;

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
      Experience: experience.map((exp) => ({
        Title: exp.title,
        Company: exp.companyName,
        StartDate: exp.startDate,
        EndDate: exp.endDate,
        Description: exp.description,
      })),
      Education: education.map((edu) => ({
        Degree: edu.degreeName,
        FieldOfStudy: edu.fieldOfStudy,
        University: edu.schoolName,
        StartDate: edu.startDate,
        EndDate: edu.endDate,
      })),
    };

    const token = localStorage.getItem('token');

    if (resume) {
      const formData = new FormData();
      formData.append('file', resume);
      console.log(loginState);
      formData.append(
        'userInfo',
        JSON.stringify({
          Id: loginState.Id,
          Service: serviceName,
          Role: role,
          Email: userKeys.email,
          Profile: {},
          Profile_details: profileDetails,
        })
      );

      try {
        const response = await fetch(
          'https://uniedge-prospect-functions.azurewebsites.net/adduser',
          {
            method: 'POST',
            body: formData,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        console.log('Response:', data);
        localStorage.setItem('login_state', JSON.stringify(data));
        setSuccess(true);
      } catch (error) {
        console.error('Error submitting profile with resume:', error);
        setError('Something went wrong. Please try again later.');
      }
    } else {
      // resume not attached;
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
        console.log('Response:', data);
        localStorage.setItem('login_state', JSON.stringify(data));
        setSuccess(true);
      } catch (error) {
        console.error('Error submitting profile:', error);
        setError('Something went wrong. Please try again later.');
      }
    }

    setSubmitting(false);
  };

  return (
    <Container className='py-5 mt-5'>
      <Row>
        <Col xs={12}>
          {error && <Alert variant='error'>{error}</Alert>}
          {success && (
            <Alert variant='success'>
              Your profile has been successfully saved.
            </Alert>
          )}
        </Col>
        <Col xs={12} md={6}>
          <h4>Upload Your LinkedIn Profile</h4>
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
              {loading ? <Spinner animation='border' size='sm' /> : 'Upload'}
            </Button>
          </InputGroup>
          <h4>Upload Your Resume/CV</h4>
          <Form.Group controlId='formFile'>
            <Form.Control type='file' onChange={handleResumeUpload} />
          </Form.Group>
        </Col>
        <Col xs={12} md={6}>
          <h4>Profile Information</h4>

          <Form className='mt-3 mb-5'>
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

            <h5 className='mt-4'>Experience</h5>
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
                            handleInputChange(
                              e,
                              'experience',
                              index,
                              'startDate'
                            )
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
                            handleInputChange(
                              e,
                              'education',
                              index,
                              'startDate'
                            )
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
                disabled={submitting}
              >
                <i className='fas fa-save me-2' />
                {submitting ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileForm;

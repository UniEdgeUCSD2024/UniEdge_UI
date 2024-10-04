import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import axios from 'axios';
import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Dropdown,
  Form,
  Row,
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './InternshipDetails.css'; // Import the CSS file for custom styles

const states = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 
  'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia', 
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 
  'Louisiana', 'Maine', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 
  'Ohio', 'Oklahoma', 'Oregon', 'Maryland', 'Massachusetts', 'Michigan', 
  'Minnesota', 'Mississippi', 'Missouri', 'Pennsylvania', 'Rhode Island', 
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

function InternshipDetails() {
  const navigate = useNavigate(); 
  const [selectedStates, setSelectedStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [jobDetails, setJobDetails] = useState(null); // Set jobDetails to null when cleared
  const [selectedJobType, setSelectedJobType] = useState('');
  const [markedAsInterested, setMarkedAsInterested] = useState(false);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('login_state'));
  const isProfileComplete = JSON.parse(localStorage.getItem('login_state'))
    .Profile?.Jobs?.Seeker;

  const [selectedSource, setSelectedSource] = useState('Uniedge');
  const [selectedType, setSelectedType] = useState('DataAnalyst');

  const jobsQuery = useQuery({
    queryKey: ['jobs', selectedType, isProfileComplete, selectedStates],
    queryFn: async () => {
      const res = await fetch(
        isProfileComplete
          ? 'https://uniedge-prospect-functions.azurewebsites.net/fetchjobdetails'
          : 'https://uniedge-prospect-functions.azurewebsites.net/fetchuniedgejobs',
        {
          headers: {
            ...(isProfileComplete && {
              Authorization: `Bearer ${token}`,
            }),
            'Content-Type': 'application/json',
          },
          method: isProfileComplete ? 'POST' : 'GET',
          ...(isProfileComplete && {
            body: JSON.stringify({
              user_id: user.Id,
              type: selectedType.replace(' ', '') ?? 'DataAnalyst',
              source: selectedSource, // Send source as part of the payload
            }),
          }),
        }
      );
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    },
  });

  // UseEffect to clear jobDetails when there are no jobs
  useEffect(() => {
    if (Array.isArray(jobsQuery.data) && jobsQuery.data.length === 0) {
      setJobDetails(null); // Clear job details when no jobs are available
    }
  }, [jobsQuery.data]);

  const fetchJobData = async ({ jobId, type, job }) => {
    try {
      setLoading(true);
      const response = await axios.post(
        'https://uniedge-prospect-functions.azurewebsites.net/fetchjobdescription',
        {
          Job_Id: job.id ?? job.job_id,
          Job_Type: type,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setJobDetails({
        ...job,
        ...response.data,
        id: jobId ?? job.id ?? job.job_id,
      });
    } catch (error) {
      console.error('Error fetching job data:', error);
      setJobDetails(null); // Clear job details in case of error
    } finally {
      setLoading(false);
    }
  };

  const handleInterest = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'https://uniedge-prospect-functions.azurewebsites.net/expressinterest',
        {
          Id: user.Id,
          Email: user.Email,
          Job_Id: jobDetails.id,
          Job_Type: selectedJobType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMarkedAsInterested(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStateSelect = (state) => {
    setSelectedStates((prevStates) =>
      prevStates.includes(state)
        ? prevStates.filter((s) => s !== state)
        : [...prevStates, state]
    );
  };

  const clearAllStates = () => {
    setSelectedStates([]);
  };

  const handleMockInterview = async () => {
    try {
      const resumeResponse = await axios.post(
        'https://uniedge-prospect-functions.azurewebsites.net/fetchresume',
        {
          Id: user.Id,
          Email: user.Email,
          Profile: {
            jobs: {
              Seeker: true,
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const name = resumeResponse.data.name;
      const resume = resumeResponse.data.resume_text;

      navigate('/mockinterview', {
        state: {
          candidate_name: name,
          custom_job_title: jobDetails.job_title,
          custom_job_description: jobDetails.job_description[0],
          candidate_resume: resume,
        },
      });
    } catch (error) {
      console.error('Error fetching resume:', error);
    }
  };

  return (
    <div className='wrapper mt-5 py-5'>
      <Container className='content'>
        {!isProfileComplete && (
          <div>
            <h6>Discover Your Perfect Job Match: Unlock 100's of Opportunities by Updating Your Profile Today!</h6>
            <Link to='/jobs/seeker/profile'>
              <Button variant='success'>Update Profile</Button>
            </Link>
          </div>
        )}
        <div className='d-flex mb-4'>
          {isProfileComplete && (
            <>
              <div className='me-4'>
                <span className='pb-2'>Source</span>
                <Form.Select
                  onChange={(e) => setSelectedSource(e.target.value)}
                  value={selectedSource}
                >
                  <option>Uniedge</option>
                  <option>LinkedIn</option>
                </Form.Select>
              </div>
              <div className='me-4'>
                <span className='pb-2'>Job Type</span> 
                <Form.Select
                  onChange={(e) => setSelectedType(e.target.value)}
                  value={selectedType}
                  className='job-type-select'
                >
                  {['DataAnalyst', 'BusinessAnalyst', 'ProductManagement', 'ProjectManagement', 'DataScientist', 'Consultant', 'HRManager', 'DataEngineer', 'Internship', 'Others'].map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </Form.Select>
              </div>
              <div>
                <span className='pb-2'>States</span>
                <Dropdown>
                  <Dropdown.Toggle className='w-100' variant='outline-secondary'>
                    {selectedStates.length > 0 ? `${selectedStates.length} selected` : 'Select States'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    className='w-100 '
                    style={{
                      maxHeight: '400px',
                      overflowY: 'auto',
                    }}
                  >
                    <Dropdown.Item
                      onClick={clearAllStates}
                      style={{
                        position: 'sticky',
                        top: 0,
                        backgroundColor: 'white',
                        color: 'red',
                      }}
                    >
                      Clear All
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    {states.map((state) => (
                      <Dropdown.Item
                        key={state}
                        onClick={() => handleStateSelect(state)}
                        active={selectedStates.includes(state)}
                      >
                        {selectedStates.includes(state) ? '✓ ' : ''}
                        {state}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </>
          )}
        </div>
      </Container>

      <Container>
        <Row className='align-items-start'>
          <Col 
            md='4' 
            className='border-end' 
            style={{ 
              maxHeight: '600px', 
              overflowY: 'auto', 
              border: '3px solid #ccc', 
              borderRadius: '10px', 
              padding: '10px', 
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' 
            }}
          >
            {jobsQuery.isLoading ? (
              'Loading...'
            ) : jobsQuery.error ? (
              'Error : ' + jobsQuery.error.message
            ) : Array.isArray(jobsQuery.data) && jobsQuery.data.length === 0 ? (
              <Container
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '50px 0',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#f8f9fa',
                    color: '#333',
                    fontWeight: '700',
                    fontSize: '18px',
                    padding: '20px 30px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    textAlign: 'center',
                    maxWidth: '600px',
                    margin: '0 auto',
                  }}
                >
                  No jobs for your choices, please come back later or explore other options.
                </div>
              </Container>
            ) : (
              jobsQuery.data
                .filter((j) => {
                  if (
                    selectedStates.length > 0 &&
                    !selectedStates.includes(j.state)
                  ) {
                    return false;
                  }

                  const isUniEdge = j.source === 'Uniedge';

                  if (selectedSource === 'Uniedge' && !isUniEdge) {
                    return false;
                  }

                  if (selectedSource === 'LinkedIn' && isUniEdge) {
                    return false;
                  }

                  return true;
                })
                .map((job) => (
                  <div
                    onClick={() => {
                      fetchJobData({ job, type: selectedType });
                      setSelectedJobType(selectedType);
                    }}
                    key={job.id || job.job_id}
                  >
                    <JobCard
                      job={job}
                      token={token}
                      selected={jobDetails?.id === (job.id || job.job_id)}
                      type={selectedType}
                      onInterest={handleInterest}
                      isInterested={markedAsInterested}
                    />
                  </div>
                ))
            )}
          </Col>

          {/* Job Details Section */}
          {jobDetails && !loading && jobsQuery.data && jobsQuery.data.length > 0 && (
            <Col md='8'>
              <Container className='p-4 mb-1'>
                <div className='d-flex justify-content-between align-items-start'>
                  <div className='flex-column'>
                    <p className='fw-semibold mb-1'>{jobDetails.company_name}</p> 
                    <h2 className='mb-0 fw-semibold'>
                      {jobDetails.job_title}
                    </h2>
                    <p>{jobDetails.company_location}</p>
                  </div>
                  <div className='d-flex align-items-center mt-3 mt-md-0'>
                    {jobDetails.source === 'Uniedge' && (
                      <>
                        <Button
                          variant={
                            markedAsInterested
                              ? 'success'
                              : 'outline-success'
                          }
                          className='fw-bold me-3'
                          onClick={(e) => handleInterest(e)}
                        >
                          {markedAsInterested
                            ? 'Interested'
                            : 'Show Interest'}
                        </Button>
                        <Button
                          variant='outline-primary'
                          className='fw-bold'
                          onClick={handleMockInterview} 
                        >
                          Mock Interview
                        </Button>
                      </>
                    )}
                    {jobDetails.company_link && (
                      <>
                        <a href={jobDetails.company_link} target='_blank' rel='noopener noreferrer'>
                          <Button variant='success' className='fw-bold me-3'>
                            Apply on employer site
                          </Button>
                        </a>
                        <Button
                          variant='outline-primary'
                          className='fw-bold'
                          onClick={handleMockInterview} 
                        >
                          Mock Interview
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                {isProfileComplete && (
                  <div className='d-flex flex-wrap mb-4'>
                    {jobDetails.Experience && (
                      <div className='me-4 d-flex flex-column align-items-center mb-3'>
                        <h6 className='fw-bold'>Experience</h6>
                        <CircularProgressbar
                          value={jobDetails.Experience}
                          text={`${jobDetails.Experience}%`}
                          styles={{
                            root: { width: '60px' },
                          }}
                        />
                      </div>
                    )}
                    {jobDetails.Technical_Skills && (
                      <div className='me-4 d-flex flex-column align-items-center mb-3'>
                        <h6 className='fw-bold'>Technical Skills</h6>
                        <CircularProgressbar
                          value={jobDetails.Technical_Skills}
                          text={`${jobDetails.Technical_Skills}%`}
                          styles={{
                            root: { width: '60px' },
                          }}
                        />
                      </div>
                    )}

                    {jobDetails["Non-Technical_Skills"] && (
                      <div className='me-4 d-flex flex-column align-items-center mb-3'>
                        <h6 className='fw-bold'>Non-Technical Skills</h6>
                        <CircularProgressbar
                          value={jobDetails["Non-Technical_Skills"]}
                          text={`${jobDetails["Non-Technical_Skills"]}%`}
                          styles={{
                            root: { width: '60px' },
                          }}
                        />
                      </div>
                    )}

                    {jobDetails.Qualifications && (
                      <div className='me-4 d-flex flex-column align-items-center mb-3'>
                        <h6 className='fw-bold'>Qualifications</h6>
                        <CircularProgressbar
                          value={jobDetails.Qualifications}
                          text={`${jobDetails.Qualifications}%`}
                          styles={{
                            root: { width: '60px' },
                          }}
                        />
                      </div>
                    )}
                    {jobDetails.Matching_Percentage && (
                      <div className='me-4 d-flex flex-column align-items-center mb-3'>
                        <h6 className='fw-bold'>Matching Percentage</h6>
                        <CircularProgressbar
                          value={jobDetails.Matching_Percentage}
                          text={`${jobDetails.Matching_Percentage}%`}
                          styles={{
                            root: { width: '60px' },
                          }}
                        />
                      </div>
                    )}                          
                  </div>
                )}
                {jobDetails.job_description && (
                  <>
                    <h6 className='fw-bold'>Job Description</h6>
                    <p>{jobDetails.job_description}</p>
                  </>
                )}
                <hr />
                {jobDetails.company_name && (
                  <p>
                    <span className='fw-bold'>Company Name:</span>{' '}
                    {jobDetails.company_name}
                  </p>
                )}
                {jobDetails.company_location && (
                  <p>
                    <span className='fw-bold'>Company Location:</span>{' '}
                    {jobDetails.company_location}
                  </p>
                )}
              </Container>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
}

export default InternshipDetails;

// JobCard Component with semi-bold company name
const JobCard = ({ job, selected }) => {
  return (
    <Card
      className={`shadow-none p-2 ${selected ? 'border border-2' : 'border-bottom border-0 rounded-0'}`}
      style={{
        cursor: 'pointer',
        backgroundColor: selected ? '#f0f0f0' : 'white', 
        color: selected ? 'black' : 'black',
        border: '1px solid #ddd', 
        borderRadius: '8px', 
        marginBottom: '10px', 
        boxShadow: selected ? '0 4px 8px rgba(0, 123, 255, 0.2)' : 'none', 
      }}
    >
      <CardBody>
        <p className='fw-semibold mb-4'>{job.company_name}</p> 
        <h6 className='fw-semibold'>{job.job_title}</h6>
        <p className='fs-6'>
          {job.city}, {job.state}
        </p>
        <Row className='justify-content-between'>
          {job.source && (
            <Col>
              <Button variant='outline-dark' size='sm'>
                {job.source}
              </Button>
            </Col>
          )}
          <Col>
            <p className='fs-6 text-end'>{job.job_posted_time}</p>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

import { useQuery } from '@tanstack/react-query';
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
import { Link } from 'react-router-dom';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function InternshipDetails() {
  const [selectedStates, setSelectedStates] = useState([]);

  // const [selectedDateFilter, setSelectedDateFilter] = useState('');

  const [loading, setLoading] = useState(false);
  const [jobDetails, setJobDetails] = useState({});
  const [selectedJobType, setSelectedJobType] = useState('');
  const [markedAsInterested, setMarkedAsInterested] = useState(false);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('login_state'));
  const isProfileComplete = JSON.parse(localStorage.getItem('login_state'))
    .Profile?.Jobs?.Seeker;

  const [selectedSource, setSelectedSource] = useState('Uniedge');

  const [selectedType, setSelectedType] = useState('DataAnalyst');

  const states = [
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
  ];

  const jobsQuery = useQuery({
    queryKey: ['jobs', selectedType, isProfileComplete],
    queryFn: async () => {
      const res = await fetch(
        isProfileComplete
          ? `https://uniedge-prospect-functions.azurewebsites.net/fetchjobdetails`
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
            }),
          }),
        }
      ); // autoselect first job

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const response = await res.json();

      console.log(response);

      if (typeof response === 'object' && !Array.isArray(response)) {
        const firstJobAndType = Object.entries(response).filter(
          ([key, value]) => value.length > 0
        )[0];

        if (firstJobAndType) {
          const [type, jobs] = firstJobAndType;
          fetchJobData({ job: jobs[0], type });
          setSelectedJobType(type);
        }
      } else if (Array.isArray(response)) {
        if (response.length > 0) {
          // fetchJobData({
          //   jobId: response[0].job_id,
          //   type: selectedType,
          //   job: response[0],
          // });
          // setSelectedJobType(selectedType);
        }
      }

      return response;
    },
  });

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
      setJobDetails({
        ...job,
        id: jobId ?? job.id ?? job.job_id,
      });
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

  return (
    <div className='wrapper mt-5 py-5'>
      <Container className='content'>
        {!isProfileComplete && (
          <div>
            <h6>
              Discover Your Perfect Job Match: Unlock 100's of Opportunities by
              Updating Your Profile Today!
            </h6>
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
                <span className='pb-2'>Internship Type</span>
                <Form.Select
                  onChange={(e) => setSelectedType(e.target.value)}
                  value={selectedType}
                >
                  {[
                    'DataAnalyst',
                    'BusinessAnalyst',
                    'ProductManagement',
                    'ProjectManagement',
                    'DataScientist',
                    'Consultant',
                    'HRManager',
                    'DataEngineer',
                    'Internship',
                    'Others',
                  ].map((role) => (
                    <option key={role}>
                      {role.replace(/([A-Z])/g, ' $1').trim()}
                    </option>
                  ))}
                </Form.Select>
              </div>
              <div>
                <span className='pb-2'>States</span>
                <Dropdown>
                  <Dropdown.Toggle
                    className='w-100'
                    variant='outline-secondary'
                  >
                    {selectedStates.length > 0
                      ? `${selectedStates.length} selected`
                      : 'Select States'}
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
        <Row>
          <Col md='4' className='border-end'>
            {jobsQuery.isLoading ? (
              'Loading...'
            ) : jobsQuery.error ? (
              'Error : ' + jobsQuery.error.message
            ) : Array.isArray(jobsQuery.data) ? (
              <>
                {jobsQuery.data
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
                        selected={jobDetails.id === (job.id || job.job_id)}
                        type={selectedType}
                        onInterest={handleInterest}
                        isInterested={markedAsInterested}
                      />
                    </div>
                  ))}
              </>
            ) : (
              Object.entries(jobsQuery.data).map(([key, value]) => {
                return (
                  <React.Fragment key={key}>
                    {value.map((job) => {
                      if (
                        selectedStates.length > 0 &&
                        !selectedStates.includes(job.state)
                      ) {
                        return null;
                      }

                      if (
                        selectedSource &&
                        selectedSource !== 'Any' &&
                        selectedSource !== job.source
                      ) {
                        return null;
                      }

                      return (
                        <div
                          onClick={() => {
                            fetchJobData({ job, type: key });
                            setSelectedJobType(key);
                          }}
                          key={job.id}
                        >
                          <JobCard
                            job={job}
                            token={token}
                            selected={jobDetails.id === job.id}
                            type={key}
                            onInterest={handleInterest}
                            isInterested={markedAsInterested}
                          />
                        </div>
                      );
                    })}
                  </React.Fragment>
                );
              })
            )}
          </Col>
          <Col>
            {loading ? (
              <p>Loading...</p>
            ) : (
              jobDetails.id && (
                <>
                  <Container className='p-4 mb-1'>
                    <div className='d-flex justify-content-between'>
                      <div className='flex-column'>
                        <div className='fw-light'>
                          {jobDetails.company_name}
                        </div>
                        <h2 className='mb-0 fw-semibold'>
                          {jobDetails.job_title}
                        </h2>
                        <p>{jobDetails.company_location}</p>
                      </div>
                      <div className='d-flex align-items-center'>
                        {jobDetails.source === 'Uniedge' && (
                          <Button
                            variant={
                              markedAsInterested ? 'success' : 'outline-success'
                            }
                            className='fw-bold'
                            onClick={(e) => handleInterest(e)}
                          >
                            {/* if interested thumbs up */}
                            {markedAsInterested
                              ? 'Interested'
                              : 'Show Interest'}
                          </Button>
                        )}
                        {jobDetails.company_link && (
                          <a href={jobDetails.company_link}>
                            <Button variant='success' className='fw-bold'>
                              Apply on employer site
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                    {isProfileComplete && (
                      <div>
                        <div className='d-flex mb-4'>
                          {jobDetails.Experience && (
                            <div className='me-4 d-flex flex-column align-items-center'>
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

                          {jobDetails.Matching_Percentage && (
                            <div className='me-4 d-flex flex-column align-items-center'>
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

                          {jobDetails.Technical_Skills && (
                            <div className='me-4 d-flex flex-column align-items-center'>
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

                          {jobDetails.Non_Technical_Skills && (
                            <div className='me-4 d-flex flex-column align-items-center'>
                              <h6 className='fw-bold'>Non-Technical Skills</h6>
                              <CircularProgressbar
                                value={jobDetails.Non_Technical_Skills}
                                text={`${jobDetails.Non_Technical_Skills}%`}
                                styles={{
                                  root: { width: '60px' },
                                }}
                              />
                            </div>
                          )}

                          {jobDetails.Qualifications && (
                            <div className='me-4 d-flex flex-column align-items-center'>
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
                        </div>
                      </div>
                    )}
                    {jobDetails.job_description && (
                      <>
                        <h6 className='fw-bold'>Job Description</h6>
                        <p>{jobDetails.job_description}</p>
                      </>
                    )}

                    <hr />

                    {/* company details */}
                    {/* "company_link": "https://www.linkedin.com/company/peerlogic?trk=public_jobs_jserp-result_job-search-card-subtitle",
        "company_location": "Scottsdale, AZ",
        "company_name": "Peerlogic", */}

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
                </>
              )
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default InternshipDetails;

const JobCard = ({ job, selected }) => {
  return (
    <Card
      className={` shadow-none p-2  ${
        selected ? 'border border-1' : 'border-bottom border-0 rounded-0'
      } `}
      style={{
        cursor: 'pointer',
        backgroundColor: selected ? '#f5f5f5' : 'white',
      }}
    >
      <CardBody>
        <p className='fw-light mb-4'>{job.company_name}</p>
        <h6 className='fw-semibold'>{job.job_title}</h6> {/* Smaller heading */}
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

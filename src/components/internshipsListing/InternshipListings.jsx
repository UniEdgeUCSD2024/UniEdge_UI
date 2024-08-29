import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Row,
} from 'react-bootstrap';

function InternshipDetails() {
  const [data, setData] = useState({});

  const [selectedType, setSelectedType] = useState('');
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedDateFilter, setSelectedDateFilter] = useState('');

  const [modal, setModal] = useState(false);
  const token = localStorage.getItem('token');

  const user = JSON.parse(localStorage.getItem('login_state'));

  const profile = JSON.parse(localStorage.getItem('login_state')).Profile?.Jobs
    ?.Seeker;

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

  const toggleModal = () => setModal(!modal);

  async function fetchData() {
    try {
      const response = await axios.get(
        'https://uniedge-prospect-functions.azurewebsites.net/fetchuniedgejobs',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [loading, setLoading] = useState(false);

  const [jobDetails, setJobDetails] = useState({});
  const [selectedJobType, setSelectedJobType] = useState('');

  const fetchJobData = async ({ job, type }) => {
    try {
      setLoading(true);
      const response = await axios.post(
        'https://uniedge-prospect-functions.azurewebsites.net/fetchjobdescription',
        {
          Job_Id: job.id,
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
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  console.log(jobDetails);

  const [markedAsInterested, setMarkedAsInterested] = useState(false);
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

  return (
    <div className='wrapper mt-5 py-5'>
      <Container className='content'>
        {profile && (
          <Row className='mb-4'>
            <Col md='2'>
              <span className='pb-2'>Internship Type</span>
              <Form.Select
                onChange={(e) => setSelectedType(e.target.value)}
                value={selectedType}
              >
                <option>Any</option>
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
            </Col>
            <Col md='2'></Col>
            <Col md='2'></Col>
          </Row>
        )}
      </Container>

      <Container>
        <Row>
          <Col md='4' className='border-end'>
            {Object.entries(data).map(([key, value]) => {
              if (
                selectedType &&
                selectedType !== 'Any' &&
                selectedType !== key
              ) {
                return null;
              }
              return (
                <>
                  {value.map((job) => {
                    return (
                      <div
                        onClick={() => fetchJobData({ job, type: key })}
                        key={job.id}
                      >
                        <JobCard
                          job={job}
                          token={token}
                          selected={jobDetails.id === job.id}
                          type={key}
                        />
                      </div>
                    );
                  })}
                </>
              );
            })}
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
                            color='success'
                            className='mx-4 fw-bold'
                            onClick={(e) => handleInterest(e)}
                          >
                            Interested
                          </Button>
                        )}
                        {jobDetails.company_link && (
                          <a href={jobDetails.company_link}>
                            <Button color='success' className=' fw-bold'>
                              Add on employer site
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </Container>

                  <Container className='border-bottom border-1 mb-3'>
                    <h6 className='fw-bold'>Job Description</h6>
                    <p>{jobDetails.job_description}</p>
                  </Container>

                  <Container className='border-bottom border-1'>
                    <h5>Company Details</h5>
                    <Row>
                      <Col></Col>
                      <Col></Col>
                    </Row>
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
      className={` shadow-none p-2   ${
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
          <Col>
            <p className='fs-6'>{job.source}</p>
          </Col>
          <Col>
            <p className='fs-6 text-end'>{job.job_posted_time}</p>
          </Col>
        </Row>
        {/* Smaller font size */}
      </CardBody>
    </Card>
  );
};

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
  UncontrolledDropdown,
} from 'reactstrap';
import useBreakpoint from '../../hooks/useBreakpoint';
import axios from 'axios';

function InternshipDetails() {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [jobState, setJobState] = useState({});

  const [allJobs, setAllJobs] = useState([]);
  const [displayedJobs, setDisplayedJobs] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedDateFilter, setSelectedDateFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [matchingResult, setMatchingResult] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalColor, setModalColor] = useState('');
  const token = localStorage.getItem('token');
  const userId = JSON.parse(localStorage.getItem('login_state')).Id;

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

  useEffect(() => {
    console.log('useeffect working');
    fetchData();
  }, []);

  useEffect(() => {
    console.log('Data:', data);
    console.log('Job:', jobState);
  }, [data, jobState]);

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

  const handleSelectRole = (role) => {
    fetchData();
  };

  return (
    <div className='wrapper mt-5 py-5'>
      <Modal
        isOpen={modal}
        toggle={toggleModal}
        contentClassName={{ color: modalColor }}
      >
        <ModalHeader toggle={toggleModal}>ATS Check</ModalHeader>
        <ModalBody>{modalContent}</ModalBody>
        <ModalFooter>
          <Button color='secondary' onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
      <Container className='content'>
        {profile && (
          <Row className='mb-4'>
            <Col md='2'>
              <UncontrolledDropdown>
                <DropdownToggle caret>Internship Type</DropdownToggle>
                <DropdownMenu>
                  {[
                    'BusinessAnalyst',
                    'DataAnalyst',
                    'DataEngineer',
                    'DataScientist',
                    'ProductManagement',
                    'ProjectManagement',
                    'Consultant',
                    'HRManager',
                  ].map((role) => (
                    <DropdownItem key={role}>
                      {role.replace(/([A-Z])/g, ' $1').trim()}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Col>
            <Col md='2'>
              <UncontrolledDropdown>
                <DropdownToggle caret>
                  {selectedStates.length > 0
                    ? selectedStates.join(', ')
                    : 'Location'}
                </DropdownToggle>
                <DropdownMenu style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {selectedStates.length > 0 && (
                    <DropdownItem>
                      <strong>Clear All</strong>
                    </DropdownItem>
                  )}
                  {states.map((state) => (
                    <DropdownItem key={state} toggle={false}>
                      {state}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Col>
            <Col md='2'>
              <UncontrolledDropdown>
                <DropdownToggle caret>
                  {selectedDateFilter || 'Date Filter'}
                </DropdownToggle>
                <DropdownMenu>
                  {[
                    'Past 24 hours',
                    '3 days ago',
                    '5 days ago',
                    '7 days ago',
                  ].map((filter) => (
                    <DropdownItem key={filter}>{filter}</DropdownItem>
                  ))}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Col>
          </Row>
        )}
      </Container>

      <Container>
        <Row>
          <Col md='4' className='border-end '>
            {Array.isArray(data.Internship) &&
              data.Internship.map((e) => (
                <JobCard
                  job={e}
                  setJobState={setJobState}
                  token={token}
                  selected={selectedRole.id === e.id}
                />
              ))}
          </Col>
          <Col>
            <Container>
              <Row></Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default InternshipDetails;

const JobCard = ({ job, setJobState, token, selected }) => {
  const fetchJobData = async () => {
    try {
      const response = await axios.post(
        'https://uniedge-prospect-functions.azurewebsites.net/fetchjobdescription',
        {
          job_id: job.id,
          type: 'Internship',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const data = await fetchJobData();
    const jobDetails = {
      ...job,
      ...data,
    };
    setJobState(jobDetails);
  };

  return (
    <Card
      className={` shadow-none p-2  cursor-pointer  ${
        selected ? 'border border-1' : 'border-bottom border-0 rounded-0'
      } `}
      onClick={(e) => handleClick(e)}
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

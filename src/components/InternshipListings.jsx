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
import useBreakpoint from '../hooks/useBreakpoint';

function InternshipDetails() {
  const navigate = useNavigate();
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

  console.log(token)
  console.log(userId)

  const profile = JSON.parse(localStorage.getItem('login_state')).Profile?.Jobs?.Seeker;
  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia',
    'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  const toggleModal = () => setModal(!modal);

  const fetchJobs = (role) => {
    setSelectedRole(role);
    setIsLoading(true);
    fetch('https://uniedge-prospect-functions.azurewebsites.net/fetchjobdetails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ type: role, user_id: userId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.length === 0) {
          setModalContent('Jobs are currently being updated. Please try refreshing later.');
          setModalColor('info');
          toggleModal();
        } else {
          console.log(data);
          setAllJobs(data);
          setDisplayedJobs(data);
        }
      })
      .catch((error) => {
        console.error('Error loading job data:', error);
      })
      .finally(() => setIsLoading(false));
  };

  const handleSelectRole = (role) => {
    fetchJobs(role);
  };

  const handleSelectState = (state) => {
    const newSelectedStates = selectedStates.includes(state)
      ? selectedStates.filter((s) => s !== state)
      : [...selectedStates, state];
    setSelectedStates(newSelectedStates);
    filterDisplayedJobs(newSelectedStates, selectedDateFilter);
  };

  const handleSelectDateFilter = (dateFilter) => {
    setSelectedDateFilter(dateFilter);
    filterDisplayedJobs(selectedStates, dateFilter);
  };

  const filterDisplayedJobs = (states, dateFilter) => {
    let filteredJobs = allJobs;
    if (states.length > 0) {
      filteredJobs = filteredJobs.filter((job) => states.includes(job.state));
    }
    if (dateFilter) {
      const daysLimit = { 'Past 24 hours': 1, '3 days ago': 3, '5 days ago': 5, '7 days ago': 7 }[dateFilter];
      filteredJobs = filteredJobs.filter((job) => {
        const daysAgo = parseInt(job.job_posted_time.split(' ')[0]) || 0;
        return daysAgo <= daysLimit;
      });
    }
    setDisplayedJobs(filteredJobs);
  };

  const matchFunction = (jobId) => {
    const jobDetails = allJobs.find((job) => job.job_id === jobId);
    if (jobDetails) {
      setMatchingResult({
        Experience: jobDetails.Experience,
        Matching_Percentage: jobDetails.Matching_Percentage,
        Non_Technical_Skills: jobDetails['Non-Technical_Skills'],
        Qualifications: jobDetails.Qualifications,
        Technical_Skills: jobDetails.Technical_Skills,
      });
      setShowOverlay(true);
    }
  };

  const clearStates = () => {
    setSelectedStates([]);
    setDisplayedJobs(allJobs);
  };

  const MatchingOverlay = () => (
    <div className='overlay'>
      <div className='matching-result'>
        <h4>Matching Results</h4>
        <p>Overall: {matchingResult?.Matching_Percentage}%</p>
        <p>Experience: {matchingResult?.Experience}%</p>
        <p>Qualifications: {matchingResult?.Qualifications}%</p>
        <p>Technical Skills: {matchingResult?.Technical_Skills}%</p>
        {matchingResult?.Non_Technical_Skills && matchingResult.Non_Technical_Skills !== 'NA' && (
          <p>Non-Technical Skills: {matchingResult.Non_Technical_Skills}%</p>
        )}
        <Button onClick={() => setShowOverlay(false)}>Close</Button>
      </div>
    </div>
  );

  const breakpoint = useBreakpoint();
  const noOfCols = breakpoint === 'xs' ? 1 : breakpoint === 'sm' ? 2 : 3;

  const dividedJobs = allJobs.reduce((acc, job, index) => {
    const colIndex = index % noOfCols;
    if (!acc[colIndex]) acc[colIndex] = [];
    acc[colIndex].push(job);
    return acc;
  }, []);

  return (
    <div className='wrapper mt-5 py-5'>
      {showOverlay && <MatchingOverlay />}
      <Modal isOpen={modal} toggle={toggleModal} contentClassName={{ color: modalColor }}>
        <ModalHeader toggle={toggleModal}>ATS Check</ModalHeader>
        <ModalBody>{modalContent}</ModalBody>
        <ModalFooter>
          <Button color='secondary' onClick={toggleModal}>Close</Button>
        </ModalFooter>
      </Modal>
      <Container className='content'>
        {profile && (
          <Row className='mb-4'>
            <Col md='2'>
              <UncontrolledDropdown>
                <DropdownToggle caret>Internship Type</DropdownToggle>
                <DropdownMenu>
                  {['BusinessAnalyst', 'DataAnalyst', 'DataEngineer', 'DataScientist', 'ProductManagement', 'ProjectManagement', 'Consultant', 'HRManager']
                    .map((role) => (
                      <DropdownItem key={role} onClick={() => handleSelectRole(role)}>
                        {role.replace(/([A-Z])/g, ' $1').trim()}
                      </DropdownItem>
                    ))}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Col>
            <Col md='2'>
              <Dropdown>
                <DropdownToggle caret>{selectedStates.length > 0 ? selectedStates.join(', ') : 'Location'}</DropdownToggle>
                <DropdownMenu style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {selectedStates.length > 0 && <DropdownItem onClick={clearStates}><strong>Clear All</strong></DropdownItem>}
                  {states.map((state) => (
                    <DropdownItem key={state} toggle={false} onClick={() => handleSelectState(state)}>
                      {state}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </Col>
            <Col md='2'>
              <Dropdown>
                <DropdownToggle caret>{selectedDateFilter || 'Date Filter'}</DropdownToggle>
                <DropdownMenu>
                  {['Past 24 hours', '3 days ago', '5 days ago', '7 days ago'].map((filter) => (
                    <DropdownItem key={filter} onClick={() => handleSelectDateFilter(filter)}>
                      {filter}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}

export default InternshipDetails;

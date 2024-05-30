import React, { useState } from 'react';
import {
  Container, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
  Card, CardHeader, CardBody, Button, Spinner, Row, Col, Dropdown
} from 'reactstrap';
import { X } from 'react-feather';

function InternshipDetails() {
  const [allJobs, setAllJobs] = useState([]);
  const [displayedJobs, setDisplayedJobs] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedDateFilter, setSelectedDateFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [matchingResult, setMatchingResult] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const token = localStorage.getItem('token');
  const user_id = JSON.parse(window.localStorage.getItem('login_state')).id;
  const selectedStatesText = selectedStates.length > 0 ? selectedStates.join(", ") : "Location";
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "District of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];

  const fetchJobs = (role) => {
    setSelectedRole(role);
    setIsLoading(true);
    const url = `https://uniedge-functions.azurewebsites.net/fetchjobdetails`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        type: role,
        user_id: user_id
      })
    })
      .then(response => response.json())
      .then(response => {
        setAllJobs(response);
        setDisplayedJobs(response);
      })
      .catch(error => console.error('Error loading job data:', error))
      .finally(() => setIsLoading(false));
  };

  const handleSelectRole = (role) => {
    fetchJobs(role);
  };

  const dateOptions = {
    "Past 24 hours": 1,
    "3 days ago": 3,
    "5 days ago": 5,
    "7 days ago": 7
  };

  const handleSelectState = (state) => {
    const index = selectedStates.indexOf(state);
    const newSelectedStates = index >= 0 ? selectedStates.filter(s => s !== state) : [...selectedStates, state];
    setSelectedStates(newSelectedStates);
    filterDisplayedJobs(newSelectedStates, selectedDateFilter);
  };

  const handleSelectDateFilter = (dateFilter) => {
    setSelectedDateFilter(dateFilter);
    filterDisplayedJobs(selectedStates, dateFilter);
  };

  const filterDisplayedJobs = (states, dateFilter) => {
    let filteredJobs = allJobs;
    if (states && states.length > 0) {
      filteredJobs = filteredJobs.filter(job => states.includes(job.state));
    }
    if (dateFilter) {
      const daysLimit = dateOptions[dateFilter];
      filteredJobs = filteredJobs.filter(job => {
        const daysAgo = parseInt(job.job_posted_time.split(' ')[0]) || 0;
        return daysAgo <= daysLimit;
      });
    }
    setDisplayedJobs(filteredJobs);
  };

  const matchFunction = (jobId) => {
    const jobDetails = allJobs.find(job => job.job_id === jobId);
    if (jobDetails) {
      setMatchingResult({
        Experience: jobDetails.Experience,
        Matching_Percentage: jobDetails.Matching_Percentage,
        Non_Technical_Skills: jobDetails["Non-Technical_Skills"],
        Qualifications: jobDetails.Qualifications,
        Technical_Skills: jobDetails.Technical_Skills
      });
      setShowOverlay(true);
    }
  };

  const clearStates = () => {
    setSelectedStates([]);
    setDisplayedJobs(allJobs);
  };

  const getTimeSincePosted = (postedTime) => {
    const postedDate = new Date(postedTime);
    const now = new Date();
    const differenceInMilliseconds = now - postedDate;
    const hours = differenceInMilliseconds / (1000 * 60 * 60);
    
    if (hours < 24) {
        return `${Math.floor(hours)} hours${Math.floor(hours) !== 1 ? 's' : ''} ago`;
    } else {
        const days = Math.floor(hours / 24);
        return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
};

  const MatchingOverlay = () => (
    <div className="overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#282c34',
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        width: '80%',
        maxWidth: '400px'
      }}>
        <div className="matching-result">
          <h4>Matching Results</h4>
          <p>Overall: {matchingResult?.Matching_Percentage}%</p>
          <p>Experience: {matchingResult?.Experience}%</p>
          <p>Qualifications: {matchingResult?.Qualifications}%</p>
          <p>Technical Skills: {matchingResult?.Technical_Skills}%</p>
          {matchingResult?.Non_Technical_Skills && matchingResult.Non_Technical_Skills !== 'NA' && (
          <p>Non-Technical Skills: {matchingResult.Non_Technical_Skills}</p>
        )}
          <Button onClick={() => setShowOverlay(false)}>Close</Button>
        </div>
      </div>
    </div>
  );

  const renderJobCards = () => (
    <div className="row">
      {displayedJobs.map((job, index) => (
        <div className="col-lg-4 col-md-6 col-sm-12" key={index}>
          <Card>
            <CardHeader>
              <h2>{job.job_title}</h2>
            </CardHeader>
            <CardBody>
              <p><strong>Company:</strong> {job.company_name}</p>
              <p><strong>Location:</strong> {job.company_location}</p>
              <p><strong>Job Posted:</strong> {job.job_posted_time}</p>
              <a href={job.job_detail_url} target="_blank">Apply</a>
              <div className="mt-3">
                <Button color="primary" onClick={() => matchFunction(job.job_id)}>Check Matching</Button>
              </div>
            </CardBody>
          </Card>
        </div>
      ))}
    </div>
  );

  const toggleDropdown = () => setDropdownOpen(prevState => !prevState);

  return (
    <div className="wrapper">
      {showOverlay && <MatchingOverlay />}
      <div className="content">
        <section className="section section-lg section-safe internship-dropdown">
          <Container>
            <Row>
              <Col md="2">
                <UncontrolledDropdown>
                  <DropdownToggle caret data-toggle="dropdown">
                    Internship Type
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={() => handleSelectRole('BusinessAnalyst')}>Business Analyst</DropdownItem>
                    <DropdownItem onClick={() => handleSelectRole('DataAnalyst')}>Data Analyst</DropdownItem>
                    <DropdownItem onClick={() => handleSelectRole('DataEngineer')}>Data Engineer</DropdownItem>
                    <DropdownItem onClick={() => handleSelectRole('DataScientist')}>Data Scientist</DropdownItem>
                    <DropdownItem onClick={() => handleSelectRole('ProductManagement')}>Product Management</DropdownItem>
                    <DropdownItem onClick={() => handleSelectRole('ProjectManagement')}>Project Management</DropdownItem>
                    <DropdownItem onClick={() => handleSelectRole('Consultant')}>Consultant</DropdownItem>
                    <DropdownItem onClick={() => handleSelectRole('HRManager')}>HRManager</DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Col>
              <Col md="2">
                <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                  <DropdownToggle caret>
                    {selectedStatesText}
                  </DropdownToggle>
                  <DropdownMenu style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {selectedStates.length > 0 && (
                      <DropdownItem onClick={clearStates}>
                        <strong>Clear All</strong>
                      </DropdownItem>
                    )}
                    {states.map(state => (
                      <DropdownItem key={state} toggle={false} onClick={() => handleSelectState(state)}>
                        <input type="checkbox" checked={selectedStates.includes(state)} readOnly /> {state}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </Col>
              <Col md="2">
                <UncontrolledDropdown>
                  <DropdownToggle caret>
                    Date Posted
                  </DropdownToggle>
                  <DropdownMenu>
                    {Object.entries(dateOptions).map(([key, _]) => (
                      <DropdownItem key={key} onClick={() => handleSelectDateFilter(key)}>
                        {key}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Col>
            </Row>
          </Container>
        </section>
        <div className="content">
          {allJobs.length === 0 ? (
            <p className="role-not-clicked">Find the latest internship opportunities tailored to your dream role by selecting your preferred position from the dropdown menu above and begin your job search journey with us.</p>
          ) : (
            <p className="role-clicked">Please find all the latest {selectedRole} internships in the USA, and take your first step at job search by applying.</p>
          )}
        </div>
        <div id="jobs-container" className="jobs-container">
          {isLoading ? (
            <div className="text-center">
              <Spinner style={{ width: '3rem', height: '3rem' }} />
              <p> {selectedRole} Internships are loading...</p>
            </div>
          ) : renderJobCards()}
        </div>
      </div>
    </div>
  );
}

export default InternshipDetails;

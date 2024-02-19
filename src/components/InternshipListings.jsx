import React, { useState } from 'react';
import {
  Container, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
  Card, CardHeader, CardBody, Spinner
} from 'reactstrap';

function InternshipDetails() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  const fetchJobs = (role) => {
    setIsLoading(true);
    const url = `https://api.jsonbin.io/v3/b/65a245c5266cfc3fde775b9f`; // Assuming URL might take role as a query parameter
    fetch(url)
      .then(response => response.json())
      .then(response => {
        setJobs(response.record);
        setSelectedRole(role); // Update the selected role
      })
      .catch(error => console.error('Error loading job data:', error))
      .finally(() => setIsLoading(false));
  };

  const handleSelectRole = (role) => {
    fetchJobs(role);
  };

  const renderJobCards = () => (
    <div className="row">
      {jobs.map((job, index) => (
        <div className="col-lg-4 col-md-6 col-sm-12" key={index}>
          <Card>
            <CardHeader>
              <h2>{job.job_title}</h2>
            </CardHeader>
            <CardBody>
              <p><strong>Company:</strong> {job.company_name}</p>
              <p><strong>Location:</strong> {job.company_location}</p>
              <p><strong>Job Listed:</strong> {job.job_listed}</p>
              <a href={job.job_detail_url}>Job URL</a>
            </CardBody>
          </Card>
        </div>
      ))}
    </div>
  );

  return (
    <div className="wrapper">
      <div className="content">
        <section className="section section-lg section-safe internship-dropdown">
          <Container>
            <UncontrolledDropdown>
              <DropdownToggle caret data-toggle="dropdown">
                Internship Type
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={() => handleSelectRole('Business Analyst')}>Business Analyst</DropdownItem>
                <DropdownItem onClick={() => handleSelectRole('Data Analyst')}>Data Analyst</DropdownItem>
                <DropdownItem onClick={() => handleSelectRole('Data Scientist')}>Data Scientist</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Container>
        </section>
        <div className="content">
          {jobs.length === 0 ? (
            <p className="role-not-clicked">Find the latest internship opportunities tailored to your dream role by selecting your preferred position from the dropdown menu above and begin your job search journey with us.</p>
          ) : (
            <p className="role-clicked">Please find all the latest {selectedRole} internships in the USA, and take your first step at job search by applying.</p>
          )}
        </div>
        <div id="jobs-container" className="jobs-container">
          {isLoading ? (
            <div className="text-center">
              <Spinner style={{ width: '3rem', height: '3rem' }} />
              <p>Internships are loading...</p>
            </div>
          ) : renderJobCards()}
        </div>
      </div>
    </div>
  );
}

export default InternshipDetails;

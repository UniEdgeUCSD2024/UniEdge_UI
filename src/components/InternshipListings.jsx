import React, { useState } from 'react';
import {
  Container, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
  Card, CardHeader, CardBody, Spinner // Import Spinner for loader animation
} from 'reactstrap';

function InternshipDetails() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // New state for loading indicator

  const handleBusinessAnalyst = () => {
    setIsLoading(true); // Start loading
    const url = 'https://api.jsonbin.io/v3/b/65a245c5266cfc3fde775b9f';
    fetch(url)
      .then(response => response.json())
      .then(response => {
        setJobs(response.record);
      })
      .catch(error => console.error('Error loading job data:', error))
      .finally(() => {
        setIsLoading(false); // Stop loading regardless of the result
      });
  };

  // This function will return a JSX element for each job
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
                <DropdownItem onClick={handleBusinessAnalyst}>Business Analyst</DropdownItem>
                <DropdownItem>Data Analyst</DropdownItem>
                <DropdownItem>Data Scientist</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Container>
        </section>
        <div id="jobs-container">
          {isLoading ? (
            <div className="text-center"> {/* Center the loader */}
              <Spinner style={{ width: '3rem', height: '3rem' }} /> {/* Styling can be adjusted */}
              <p>Internships are loading...</p>
            </div>
          ) : (
            jobs.length > 0 && renderJobCards()
          )}
        </div>
      </div>
    </div>
  );
}

export default InternshipDetails;

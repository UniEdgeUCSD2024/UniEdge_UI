import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "reactstrap";
import useBreakpoint from "../../hooks/useBreakpoint";
import axios from "axios";

function InternshipDetails() {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [jobState, setJobState] = useState({});

  const [allJobs, setAllJobs] = useState([]);
  const [displayedJobs, setDisplayedJobs] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedDateFilter, setSelectedDateFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [matchingResult, setMatchingResult] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalColor, setModalColor] = useState("");
  const token = localStorage.getItem("token");
  const userId = JSON.parse(localStorage.getItem("login_state")).Id;

  const profile = JSON.parse(localStorage.getItem("login_state")).Profile?.Jobs
    ?.Seeker;
  const states = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "District of Columbia",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];

  const toggleModal = () => setModal(!modal);

  useEffect(() => {
    console.log("useeffect working");
    fetchData();
  }, []);

  useEffect(() => {
    console.log("Data:", data);
    console.log("Job:", jobState);
  }, [data, jobState]);

  async function fetchData() {
    try {
      const response = await axios.get(
        "https://uniedge-prospect-functions.azurewebsites.net/fetchuniedgejobs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const handleSelectRole = (role) => {
    fetchData();
  };

  return (
    <div className="wrapper mt-5 py-5">
      <Modal
        isOpen={modal}
        toggle={toggleModal}
        contentClassName={{ color: modalColor }}
      >
        <ModalHeader toggle={toggleModal}>ATS Check</ModalHeader>
        <ModalBody>{modalContent}</ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
      <Container className="content">
        {profile && (
          <Row className="mb-4">
            <Col md="2">
              <UncontrolledDropdown>
                <DropdownToggle caret>Internship Type</DropdownToggle>
                <DropdownMenu>
                  {[
                    "BusinessAnalyst",
                    "DataAnalyst",
                    "DataEngineer",
                    "DataScientist",
                    "ProductManagement",
                    "ProjectManagement",
                    "Consultant",
                    "HRManager",
                  ].map((role) => (
                    <DropdownItem key={role}>
                      {role.replace(/([A-Z])/g, " $1").trim()}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Col>
            <Col md="2">
              <UncontrolledDropdown>
                <DropdownToggle caret>
                  {selectedStates.length > 0
                    ? selectedStates.join(", ")
                    : "Location"}
                </DropdownToggle>
                <DropdownMenu style={{ maxHeight: "300px", overflowY: "auto" }}>
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
            <Col md="2">
              <UncontrolledDropdown>
                <DropdownToggle caret>
                  {selectedDateFilter || "Date Filter"}
                </DropdownToggle>
                <DropdownMenu>
                  {[
                    "Past 24 hours",
                    "3 days ago",
                    "5 days ago",
                    "7 days ago",
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
          <Col md="4">
            {data.Internship &&
              data.Internship.map((e) => (
                <JobCard job={e} setJobState={setJobState} token={token} />
              ))}
          </Col>
          <Col>
            <Container>
                <Row>
                   
                </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default InternshipDetails;

const dummy = {
  city: "san diego",
  company_link: "",
  company_location: "san diego, California",
  company_name: "abcd",
  id: "2089076",
  job_detail_url: "",
  job_posted_time: "3 days ago",
  job_title: "sde",
  recruiter: "guest",
  source: "Uniedge",
  state: "California",
};

const JobCard = ({ job, setJobState, token }) => {
  const [hover, setHover] = useState(false);

  const fetchJobData = async () => {
    try {
      const response = await axios.post(
        "https://uniedge-prospect-functions.azurewebsites.net/fetchjobdescription",
        {
          job_id: job.id,
          type: "Internship",
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
      className="p-2 rounded-2 bg-primary-subtle cursor-pointer"
      style={{
        maxHeight: "120px",
        overflowY: "auto",
        border: hover ? "0.5px solid gray" : "none",
        cursor: hover ? "pointer" : "default",
      }} // Smaller max-height
      onMouseEnter={() => setHover(true)} // Handle hover state
      onMouseLeave={() => setHover(false)} // Reset on hover out
      onClick={(e) => handleClick(e)}
    >
      <CardBody className="d-flex justify-content-between align-items-center p-2">
        <div
          className="d-flex gap-2 align-items-center"
          style={{ fontSize: "0.65rem" }}
        >
          <img
            src=""
            alt="Company Logo"
            style={{
              width: "14px", // Smaller image size
              height: "14px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <div className="fw-bold">{job.company_name}</div>
          <div>3.3</div>
        </div>
        <a
          variant="outline-secondary"
          size="sm"
          style={{ height: "14px", width: "14px" }}
        >
          <img />
        </a>
      </CardBody>
      <CardBody className="p-2">
        <h6 className="fw-bolder mb-0" style={{ fontSize: "0.85rem" }}>
          {job.job_title}
        </h6>{" "}
        {/* Smaller heading */}
        <div className="small mb-0" style={{ fontSize: "0.65rem" }}>
          {job.city}
        </div>{" "}
        {/* Smaller font size */}
        <Row
          className="d-flex justify-content-between"
          style={{ fontSize: "0.65rem" }}
        >
          <Col>8 to 10 lakh</Col> {/* Reduced padding */}
          <Col className="text-end">{job.job_posted_time}</Col>{" "}
          {/* Reduced padding */}
        </Row>
      </CardBody>
    </Card>
  );
};

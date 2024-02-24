import React, { useContext, useRef, useState, useEffect } from "react";
import { Spinner } from 'reactstrap';
import Footer from "../Footer/Footer";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext, useAuth } from "../../context/AuthContext";
import {
    Form,
    Button,
    Card,
    Alert,
    Container,
    Row,
    Col,
    Input,
    Label,
    CardHeader,
    CardImg,
    CardBody,
    CardTitle,
    FormGroup,
    CardFooter,
} from "reactstrap";

export default function StudentProfile() {
    const navigate = useNavigate();
    const { userKeys } = useContext(AuthContext);
    const FirstNameRef = useRef();
    const LastNameRef = useRef();
    const MobileNumberRef = useRef();
    var [loginState, setLoginState] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [experiences, setExperiences] = useState([]);
    const [resume, setResume] = useState(null);
    const [resumeName, setResumeName] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    const [loginLoading, setLoginLoading] = useState(true); 
    const [isLoginStateChecked, setIsLoginStateChecked] = useState(false);

    useEffect(() => {
        const checkLoginState = () => {
            loginState = JSON.parse(localStorage.getItem('login_state'));
            if (loginState) {
                setIsLoginStateChecked(true);
            } else {
                setIsLoginStateChecked(false);
            }
        };
        window.addEventListener('storage', checkLoginState);
        checkLoginState();
        return () => {
            window.removeEventListener('storage', checkLoginState);
        };
    }, []);
    if (!isLoginStateChecked) {
        console.log(isLoginStateChecked);
        return (
            <div class="loader-container">
                <Spinner style={{ width: '3rem', height: '3rem' }} />
                <p>Checking login status...</p>
            </div>
        );
    }    
    async function handleSubmit(e) {
        e.preventDefault();
        const userInfo = {
            id: JSON.parse(localStorage.getItem('login_state')).id.toString(),
            profile: JSON.parse(localStorage.getItem('login_state')).profile,
            firstName: FirstNameRef.current.value,
            lastName: LastNameRef.current.value,
            mobileNumber: MobileNumberRef.current.value,
            experiences: experiences,
        };
        const formData = new FormData();
        formData.append('file', resume);
        formData.append('userInfo', JSON.stringify(userInfo));
        setLoading(true);
        setError('');
        try {
            const response = await fetch('https://uniedge-functions.azurewebsites.net/adduser', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } 
            const responseData = await response.json();
            console.log(responseData)
        } catch (error) {
            console.error('Error submitting the profile data:', error);
            setError('Failed to submit profile.');
        } finally {
            setLoading(false);
        }
    }
    
    const addExperience = () => {
        setExperiences([...experiences, { years: '', role: '', company: '' }]);
    };

    const handleExperienceChange = (index, field, value) => {
        const newExperiences = [...experiences];
        newExperiences[index][field] = value;
        setExperiences(newExperiences);
    };
    const removeExperience = (index) => {
        setExperiences(experiences.filter((_, i) => i !== index));
    };
    const handleResumeChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setResume(e.target.files[0]);
            setResumeName(e.target.files[0].name);
        }
    };
    return (
        <>
            <section class="section section-lg section-safe">
                <Container>
                    <div class="wrapper">
                        <div class="profile-intro">
                            Hello {userKeys && userKeys.username ? userKeys.username : "there"}! It's time to unleash your full potential and let opportunities find their way to you. Simply upload your resume and fill in the remaining details to give your profile that extra edge. Our Advanced Matching will work like a charm to connect you with jobs that fit like a glove - jobs that aren't just good, but are perfect for you. Get started and watch how we tailor the job hunt to your unique skills and aspirations!
                        </div>
                    </div>
                    <Row>
                        <Col class="offset-lg-0 offset-md-3" lg="10" md="6">
                            <Card class="card-register">
                                <CardBody>
                                    {error && <Alert color="danger">{error}</Alert>}
                                    <Form class="form" onSubmit={handleSubmit}>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="firstName">First Name</Label>
                                                <Input
                                                    id="firstName"
                                                    innerRef={FirstNameRef}
                                                    placeholder="First Name"
                                                    type="text"
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="lastName">Last Name</Label>
                                                <Input
                                                    id="lastName"
                                                    innerRef={LastNameRef}
                                                    placeholder="Last Name"
                                                    type="text"
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="lastName">Mobile Number</Label>
                                                <Input
                                                    id="mobileNumber"
                                                    innerRef={MobileNumberRef}
                                                    placeholder="Mobile Number"
                                                    type="text"
                                                />
                                            </FormGroup>
                                        </Col>
                                        {experiences.map((experience, index) => (
                                            <Row key={index}>
                                                <Col md={3}>
                                                    <FormGroup>
                                                        <Label>Years</Label>
                                                        <Input
                                                            value={experience.years}
                                                            onChange={(e) => handleExperienceChange(index, 'years', e.target.value)}
                                                            placeholder="Years"
                                                            type="number"
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md={3}>
                                                    <FormGroup>
                                                        <Label>Role</Label>
                                                        <Input
                                                            value={experience.role}
                                                            onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
                                                            placeholder="Role"
                                                            type="text"
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md={3}>
                                                    <FormGroup>
                                                        <Label>Company</Label>
                                                        <Input
                                                            value={experience.company}
                                                            onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                                                            placeholder="company"
                                                            type="text"
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md={2} class="align-self-center">
                                                    <Button close onClick={() => removeExperience(index)}>
                                                        <span aria-hidden>&times;</span>
                                                    </Button>
                                                </Col>
                                            </Row>
                                        ))}
                                        <div class="add-experience">
                                            <Button color="primary" onClick={addExperience} style={{ marginBottom: '1rem' }}>
                                                + Add Experience
                                            </Button>
                                        </div>
                                        <Col md={5}>
                                            <FormGroup>
                                                <Label for="resumeUpload">Upload Resume</Label>
                                                <Input
                                                    id="resumeUpload"
                                                    type="file"
                                                    onChange={handleResumeChange}
                                                    style={{ marginBottom: '1rem' }}
                                                />
                                                {resumeName && <div class="resume-name">Resume: {resumeName}</div>}
                                            </FormGroup>
                                        </Col>
                                        <Button disabled={loading} color="info" size="sm" type="submit">
                                            Submit
                                        </Button>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>
            <Footer />
        </>
    );
}

import React, { useContext, useState, useEffect } from "react";
import { Spinner } from 'reactstrap';
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
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
    CardBody,
    FormGroup,
} from "reactstrap";

export default function StudentProfile() {
    const navigate = useNavigate();
    const { userKeys } = useContext(AuthContext);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [resume, setResume] = useState(null);
    const [resumeName, setResumeName] = useState("");
    const [updating, setUpdating] = useState(false);
    const [updateMessage, setUpdateMessage] = useState("");
    const [isLoginStateChecked, setIsLoginStateChecked] = useState(false);

    useEffect(() => {
        const checkLoginState = () => {
            const loginState = JSON.parse(window.localStorage.getItem('login_state'));
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
        return (
            <div className="loader-container">
                <Spinner style={{ width: '3rem', height: '3rem' }} />
                <p>Checking login status...</p>
            </div>
        );
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setUpdating(true);
        setUpdateMessage("Uploading Resume...");
        setLoading(true);
        setError('');

        // Fetch the user ID and profile data from local storage
        const loginState = JSON.parse(window.localStorage.getItem('login_state'));
        const userId = loginState?.id || "1012"; // Default to "1012" if not found
        const userProfile = loginState?.profile || {};

        // Create userInfo object with additional profile information
        const userInfo = {
            Id: userId,
            Service: "careers",
            Role: "Seeker",
            Profile: userProfile,  // Include the profile data here
        };

        const formData = new FormData();
        formData.append('file', resume);
        formData.append('userInfo', JSON.stringify(userInfo));

        const token = localStorage.getItem('token');
        try {
            const response = await fetch('https://uniedge-prospect-functions.azurewebsites.net/adduser', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();

            // Store the response back in local storage
            const updatedLoginState = {
                Profile: responseData.Profile,
                Services: responseData.Services,
                id: responseData.id
            };
            localStorage.setItem('login_state', JSON.stringify(updatedLoginState));

            if (responseData.Profile || responseData.Services?.careers?.Seeker) {
                window.localStorage.setItem('resume', resume);
                setUpdating(false);
                setLoading(false);
                setSuccess('Resume Uploaded Successfully');
            }
        } catch (error) {
            console.error('Error uploading the resume:', error);
            setError('Failed to upload resume.');
        } finally {
            setLoading(false);
            setUpdating(false);
            setUpdateMessage("");
        }
    }

    if (updating) {
        return (
            <div className="loader-container">
                <Spinner style={{ width: '3rem', height: '3rem' }} />
                <p style={{ margin: '1rem' }}>{updateMessage}</p>
            </div>
        );
    }

    const handleResumeChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setResume(e.target.files[0]);
            setResumeName(e.target.files[0].name);
        }
    };

    return (
        <>
            <section className="section section-lg section-safe" style={{ backgroundColor: 'white', minHeight: '100vh' }}>
                <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                    <div className="text-center mb-4" style={{ marginTop: '-100px', color: '#000', fontWeight: 'bold' }}>
                        <p>Hello {userKeys && userKeys.username ? userKeys.username : "there"}! It's time to unleash your full potential and let opportunities find their way to you. Simply upload your resume and let us handle the rest. Our Advanced Matching will work like a charm to connect you with jobs that fit like a glove - jobs that aren't just good, but perfect for you. Get started and watch how we tailor the job hunt to your unique skills and aspirations!</p>
                    </div>
                    <h2 className="text-center mb-4" style={{ fontWeight: 'bold', color: '#000' }}>Upload your Resume / CV</h2>
                    <Row className="w-100 justify-content-center">
                        <Col lg="6" md="8">
                            <Card className="card-register" style={{ backgroundColor: 'white' }}>
                                <CardBody>
                                    {error && <Alert color="danger">{error}</Alert>}
                                    {success && <Alert color="success">{success}</Alert>}
                                    <Form className="form" onSubmit={handleSubmit}>
                                        <FormGroup>
                                            <Label for="resumeUpload">Upload Resume</Label>
                                            <Input
                                                id="resumeUpload"
                                                type="file"
                                                onChange={handleResumeChange}
                                                style={{ marginBottom: '1rem', backgroundColor: '#ccc', color: '#333', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer' }}
                                            />
                                            {resumeName && <div className="resume-name mt-2">Resume: {resumeName}</div>}
                                        </FormGroup>
                                        <div className="text-center">
                                            <Button disabled={loading} color="info" size="sm" type="submit">
                                                Submit
                                            </Button>
                                        </div>
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

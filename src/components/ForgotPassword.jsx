import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Import your AuthContext if you use one
import { Alert, Button, Form, FormGroup, Input, Label, Container } from 'reactstrap';
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth(); // Method from AuthContext

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setMessage('');
      setError('');
      setLoading(true);
      await resetPassword(email);
      setMessage('Check your inbox for further instructions.');
    } catch {
      setError('Failed to reset password');
    }
    setLoading(false);
  }

  return (
    <Container style={{ maxWidth: '400px' }}>
      {error && <Alert color="danger">{error}</Alert>}
      {message && <Alert color="success">{message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </FormGroup>
        <Button disabled={loading} type="submit" color="primary">
          Reset Password
        </Button>
      </Form>
      <div className="w-100 text-center mt-3">
        <Button color="link" onClick={() => {navigate("/internships") }}>Login</Button>
      </div>
    </Container>
  );
}

export default ForgotPassword;

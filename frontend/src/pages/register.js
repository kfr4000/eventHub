import React, { useState } from 'react';
import { registerUser } from '../utils/api';
import { Form, Button, Container, Spinner } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const data = await registerUser(formData);
      localStorage.setItem('token', data.token);
      setMessage(`Registration successful! Welcome, ${data.username}`);
      router.push('/'); // Automatically log in and redirect to the homepage
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <Container className="my-4">
      <h1>Register</h1>
      <Form onSubmit={handleRegister}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />{' '}
              Registering...
            </>
          ) : (
            'Register'
          )}
        </Button>
      </Form>
      {message && <p className="mt-3 text-danger">{message}</p>}
      <p className="mt-3">
        Already have an account? <Link href="/login">Login here</Link>
      </p>
    </Container>
  );
}

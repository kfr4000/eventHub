import React, { useState } from 'react';
import { loginUser } from '../utils/api';
import { Form, Button, Container, Spinner } from 'react-bootstrap';
import { useRouter } from 'next/router';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const data = await loginUser(credentials);
      localStorage.setItem('token', data.token);
      router.push('/'); // 로그인 성공 시 메인 페이지로 이동
    } catch (error) {
      setMessage('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-4">
      <h1>Login</h1>
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3" disabled={loading}>
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />{' '}
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </Button>
        {message && <p className="mt-3 text-danger">{message}</p>}
      </Form>
    </Container>
  );
}

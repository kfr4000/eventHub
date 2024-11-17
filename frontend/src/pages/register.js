// frontend/src/pages/register.js

import React, { useState } from 'react';
import { registerUser } from '../utils/api';
import { Form, Button, Container } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);

  // useRouter는 컴포넌트 함수 내부에 선언
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      const data = await registerUser({ username, email, password });
      localStorage.setItem('token', data.token); // 회원가입 후 받은 토큰 저장 (자동 로그인)
      setMessage(`Registration successful! Welcome, ${data.username}`);

      // 회원가입 후 로그인 페이지로 자동 이동
      router.push('/login');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <Container className="my-4">
      <h1>Register</h1>
      <Form onSubmit={handleRegister}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
      {message && <p className="mt-3">{message}</p>}
      <p className="mt-3">
        Already have an account? <Link href="/login">Login here</Link>
      </p>
    </Container>
  );
}

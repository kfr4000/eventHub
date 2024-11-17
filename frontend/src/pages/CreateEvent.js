// frontend/src/pages/CreateEvent.js

import React, { useState } from 'react';
import { Container, Form, Button, Spinner } from 'react-bootstrap';
import { useRouter } from 'next/router';

export default function CreateEvent() {
  const [formData, setFormData] = useState({
    organizer: '',
    name: '',
    title: '',
    description: '',
    date: '',
    location: '',
    imageUrl: ''
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    if (Object.values(formData).some((field) => !field)) {
      setMessage('All fields are required. Please fill out every field.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('Event created successfully!');
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        const errorData = await response.json();
        setMessage(`Failed to create event: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      setMessage(`Failed to create event: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-4">
      <h1>Create Event</h1>
      <Form onSubmit={handleCreateEvent}>
        {['organizer', 'name', 'title', 'description', 'date', 'location', 'imageUrl'].map((field) => (
          <Form.Group className="mb-3" key={field}>
            <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
            <Form.Control
              type={field === 'description' ? 'textarea' : field === 'date' ? 'date' : 'text'}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
              as={field === 'description' ? 'textarea' : 'input'}
              rows={field === 'description' ? 3 : undefined}
            />
          </Form.Group>
        ))}
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Creating...
            </>
          ) : (
            'Create Event'
          )}
        </Button>
      </Form>
      {message && <p className="mt-3 text-danger">{message}</p>}
    </Container>
  );
}
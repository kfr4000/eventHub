// frontend/src/pages/CreateEvent.js

import React, { useState } from 'react';
import { Container, Form, Button, Spinner } from 'react-bootstrap';
import { useRouter } from 'next/router';

export default function CreateEvent() {
  const [organizer, setOrganizer] = useState('');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    if (!organizer || !name || !title || !description || !date || !location || !imageUrl) {
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
        body: JSON.stringify({ organizer, name, title, description, date, location, imageUrl }),
      });

      if (response.ok) {
        setMessage('Event created successfully!');
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        const errorData = await response.json();
        if (errorData.errors) {
          const errorMessages = Object.values(errorData.errors).map((err) => err.message).join(', ');
          setMessage(`Failed to create event: ${errorMessages}`);
        } else {
          setMessage(`Failed to create event: ${errorData.message}`);
        }
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
        <Form.Group className="mb-3">
          <Form.Label>Organizer</Form.Label>
          <Form.Control
            type="text"
            value={organizer}
            onChange={(e) => setOrganizer(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Event Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />{' '}
              Creating...
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

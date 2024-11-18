// frontend/src/pages/CreateEvent.js

import React, { useState } from 'react';
import { Container, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { useRouter } from 'next/router';
import axios from 'axios';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You must be logged in to add an event.');
        setVariant('danger');
        setLoading(false);
        return;
      }
      await createEvent(formData, token);
      setMessage('Event added successfully!');
      setVariant('success');
      setFormData({ title: '', description: '', date: '', location: '', imageUrl: '' });
      router.push('/events'); // Redirect to events page or another page
    } catch (error) {
      console.error('Error adding event:', error);
      setMessage(error.response?.data?.message || 'Error adding event.');
      setVariant('danger');
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (data, token) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/events`;
    console.log('Creating event at URL:', url); // Debugging line
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  };

  return (
    <Container>
      <h1 className="my-4">Create Event</h1>
      {message && <Alert variant={variant}>{message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="date">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="location">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="imageUrl">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter image URL"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
          />
        </Form.Group>

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
    </Container>
  );
};

export default CreateEvent;
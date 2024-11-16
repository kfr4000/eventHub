import { useState } from 'react';
import { createEvent } from '../utils/api';
import { Form, Button, Container } from 'react-bootstrap';

export default function CreateEvent() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState(null);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setMessage(null);

    const token = localStorage.getItem('token'); // 로그인한 사용자의 토큰 가져오기
    if (!token) {
      setMessage('Please log in to create an event.');
      return;
    }

    try {
      const eventData = { name, description, date, location };
      const data = await createEvent(eventData, token);
      setMessage(`Event "${data.name}" created successfully!`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <Container className="my-4">
      <h1>Create Event</h1>
      <Form onSubmit={handleCreateEvent}>
        <Form.Group controlId="formEventName" className="mb-3">
          <Form.Label>Event Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formEventDescription" className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formEventDate" className="mb-3">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formEventLocation" className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Create Event
        </Button>
      </Form>
      {message && <p className="mt-3">{message}</p>}
    </Container>
  );
}

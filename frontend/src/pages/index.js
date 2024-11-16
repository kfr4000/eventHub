// frontend/src/pages/index.js
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { fetchEvents, createEvent, deleteEvent } from '../utils/api';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }

    const loadEvents = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch {
        setMessage('Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const addedEvent = await createEvent(newEvent);
      setEvents([...events, addedEvent]);
      setNewEvent({ title: '', description: '', date: '', location: '' });
    } catch {
      setMessage('Failed to create event');
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await deleteEvent(id);
      setEvents(events.filter((event) => event._id !== id));
    } catch {
      setMessage('Failed to delete event');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (message) {
    return <p>{message}</p>;
  }

  return (
    <Container className="my-4">
      <h1>EventHub</h1>
      {!isLoggedIn ? (
        <>
          <Link href="/login">
            <Button variant="primary" className="me-3">Login</Button>
          </Link>
          <Link href="/register">
            <Button variant="secondary">Register</Button>
          </Link>
        </>
      ) : (
        <>
          <Button variant="danger" onClick={handleLogout} className="mb-4">
            Logout
          </Button>
          <Form className="mb-4" onSubmit={handleCreateEvent}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Add Event
            </Button>
          </Form>
        </>
      )}

      <Row>
        {events.map((event) => (
          <Col key={event._id} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{event.title}</Card.Title>
                <Card.Text>{event.description}</Card.Text>
                <Card.Text>
                  <strong>Date: </strong>
                  {new Date(event.date).toLocaleDateString()}
                </Card.Text>
                <Card.Text>
                  <strong>Location: </strong>
                  {event.location}
                </Card.Text>
                <Link href={`/events/${event._id}`} passHref>
                  <Button variant="primary">View Details</Button>
                </Link>
                {isLoggedIn && (
                  <Button variant="danger" className="mt-3" onClick={() => handleDeleteEvent(event._id)}>
                    Delete
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

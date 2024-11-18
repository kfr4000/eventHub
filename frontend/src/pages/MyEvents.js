import React, { useState, useEffect } from 'react';
import { getUserHostedEvents, getUserJoinedEvents } from '../utils/api';
import { Container, Spinner, ListGroup } from 'react-bootstrap';

export default function MyEvents() {
  const [hostedEvents, setHostedEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      setMessage(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Please log in to view your events.');
        setLoading(false);
        return;
      }

      try {
        const hostedData = await getUserHostedEvents(token);
        const joinedData = await getUserJoinedEvents(token);
        setHostedEvents(hostedData);
        setJoinedEvents(joinedData);
      } catch {
        setMessage('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  if (loading) {
    return (
      <Container className="my-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h1>My Events</h1>
      {message && <p className="text-danger">{message}</p>}

      <h2>Hosted Events</h2>
      {hostedEvents.length === 0 ? <p>No hosted events found.</p> : (
        <ListGroup className="mb-4">
          {hostedEvents.map((event) => (
            <ListGroup.Item key={event._id}>
              {event.name} - {new Date(event.date).toLocaleDateString()}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      <h2>Joined Events</h2>
      {joinedEvents.length === 0 ? <p>No joined events found.</p> : (
        <ListGroup>
          {joinedEvents.map((event) => (
            <ListGroup.Item key={event._id}>
              {event.name} - {new Date(event.date).toLocaleDateString()}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
}

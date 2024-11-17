// frontend/src/pages/event/[id].js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';

export default function EventDetail() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchEventDetail();
    }
  }, [id]);

  const fetchEventDetail = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch event details');
      }
      const data = await response.json();
      setEvent(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Container className="my-4">Loading...</Container>;
  }

  if (error) {
    return <Container className="my-4">Error: {error}</Container>;
  }

  return (
    <Container className="my-4">
      <Row>
        <Col md={6}>
          <Image src={event.imageUrl} alt={event.title} fluid />
        </Col>
        <Col md={6}>
          <h1>{event.title}</h1>
          <p><strong>Organizer:</strong> {event.organizer}</p>
          <p><strong>Event Name:</strong> {event.name}</p>
          <p><strong>Description:</strong> {event.description}</p>
          <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
          <p><strong>Location:</strong> {event.location}</p>
          <Button variant="primary" onClick={() => router.push('/')}>Back to Events</Button>
        </Col>
      </Row>
    </Container>
  );
}

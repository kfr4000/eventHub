// frontend/src/pages/event/[id].js

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Col, Image, Button, Spinner } from 'react-bootstrap';

export default function EventDetail() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  const fetchEventDetail = useCallback(async () => {
    if (!id) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}`);
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
  }, [id]);

  useEffect(() => {
    fetchEventDetail();
  }, [fetchEventDetail]);

  if (loading) {
    return (
      <Container className="my-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return <Container className="my-4">Error: {error}</Container>;
  }

  if (!event) {
    return <Container className="my-4">Event not found.</Container>;
  }

  return (
    <Container className="my-4">
      <Row>
        <Col md={6}>
          <Image src={event.imageUrl || 'https://via.placeholder.com/600x400?text=No+Image+Available'} alt={event.title} fluid />
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

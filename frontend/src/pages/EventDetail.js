// frontend/src/pages/EventDetail.js

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Col, Card, Spinner, Alert, Button, Image } from 'react-bootstrap';

export default function EventDetail() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  const fetchEventDetails = useCallback(async () => {
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
    fetchEventDetails();
    return () => {
      setLoading(false);
    };
  }, [fetchEventDetails]);

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
    <Container>
      <Row className="my-4">
        <Col md={8}>
          <Image src={event.imageUrl || 'https://via.placeholder.com/600x400?text=No+Image+Available'} alt={event.title} fluid />
          <h1>{event.title}</h1>
          <p>{event.description}</p>
        </Col>
        <Col md={4}>
          <h4>Event Details</h4>
          <p>Date: {new Date(event.date).toLocaleDateString()}</p>
          <p>Location: {event.location}</p>
          <Button variant="primary" onClick={() => router.push('/')}>Join Event</Button>
        </Col>
      </Row>
    </Container>
  );
}

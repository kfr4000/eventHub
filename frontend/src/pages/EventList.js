// frontend/src/pages/EventList.js

import React, { useState, useEffect } from 'react';
import { fetchEvents } from '../utils/api';
import { Container, Row, Col, Card, Spinner, Alert, Button, Form } from 'react-bootstrap';
import Link from 'next/link';

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [category, setCategory] = useState('All');
  const [date, setDate] = useState('');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch {
        setMessage('Failed to load events.');
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const filteredEvents = events.filter((event) => {
    return (
      (category === 'All' || event.category === category) &&
      (!date || new Date(event.date).toLocaleDateString() === new Date(date).toLocaleDateString())
    );
  });

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
      <Row>
        <Col md={3}>
          <h4>Filters</h4>
          <Form>
            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control as="select" value={category} onChange={handleCategoryChange}>
                <option>All</option>
                <option>Music</option>
                <option>Sports</option>
                <option>Business</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="date">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" value={date} onChange={handleDateChange} />
            </Form.Group>
          </Form>
        </Col>
        <Col md={9}>
          <h2>Events</h2>
          <Row>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <Col key={event._id} md={4} className="mb-4">
                  <Card>
                    <Card.Body>
                      <Card.Title>{event.name}</Card.Title>
                      <Card.Text>
                        {event.description.length > 100
                          ? event.description.substring(0, 100) + '...'
                          : event.description}
                      </Card.Text>
                      <Card.Text>
                        <strong>Date: </strong>
                        {new Date(event.date).toLocaleDateString()}
                      </Card.Text>
                      <Link href={`/events/${event._id}`} passHref>
                        <Button variant="primary">View Details</Button>
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <p>No events available.</p>
            )}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

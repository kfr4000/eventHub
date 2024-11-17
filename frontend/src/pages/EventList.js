import React, { useState, useEffect } from 'react';
import { fetchEvents } from '../utils/api';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch {
        setMessage('Failed to load events.');
      }
    };
    loadEvents();
  }, []);

  return (
    <Container className="my-4">
      <h1>All Events</h1>
      {message && <p>{message}</p>}
      <Row>
        {events.map((event) => (
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
        ))}
      </Row>
    </Container>
  );
}

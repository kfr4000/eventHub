import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

export default function DiscoverSection({ events = [] }) {
  if (!events.length) {
    return (
      <Container className="text-center py-5">
        <h2>No events available to discover</h2>
      </Container>
    );
  }

  return (
    <div className="discover-section py-5">
      <Container>
        <h2 className="mb-4">Discover Events</h2>
        <Row>
          {events.map((event) => (
            <Col md={4} key={event._id} className="mb-4">
              <Card>
                <Card.Img
                  variant="top"
                  src={event.imageUrl || 'https://via.placeholder.com/300x200'}
                  alt={event.title || 'Event Image'}
                />
                <Card.Body>
                  <Card.Title>{event.title || 'Untitled Event'}</Card.Title>
                  <Card.Text>{event.description || 'No description available'}</Card.Text>
                  <Button variant="primary">View Details</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

// frontend/src/components/EventCard.js

import React from 'react';
import { Card, Button, Col } from 'react-bootstrap';
import Link from 'next/link';

export default function EventCard({ event, index }) {
  return (
    <Col md={4} className="mb-4">
      <Card>
        <Card.Img variant="top" src={event.imageUrl || `https://via.placeholder.com/300x200?text=Sample+Event+${index + 1}`} />
        <Card.Body>
          <Card.Title>{event.title || `Sample Event ${index + 1}`}</Card.Title>
          <Card.Text>{event.description || 'Join us for an exciting event you will never forget.'}</Card.Text>
          <Link href={`/EventDetail/${event._id || `sample-event-${index + 1}`}`} passHref>
            <Button variant="primary">View Details</Button>
          </Link>
        </Card.Body>
      </Card>
    </Col>
  );
}
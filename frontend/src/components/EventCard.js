// frontend/src/components/EventCard.js

import React from 'react';
import { Card, Button, Col } from 'react-bootstrap';
import Link from 'next/link';

export default function EventCard({ event, index }) {
  // 데이터 유효성 검사
  if (!event || typeof event !== 'object' || !event.title) {
    console.warn(`Invalid event data at index ${index}`, event);
    return null; // 이벤트 데이터가 유효하지 않으면 아무것도 렌더링하지 않음
  }

  return (
    <Col md={4} className="mb-4">
      <Card>
        <Card.Img
          variant="top"
          src={event.imageUrl || `https://via.placeholder.com/300x200?text=Sample+Event+${index + 1}`}
          alt={event.title || `Sample Event ${index + 1}`}
        />
        <Card.Body>
          <Card.Title>{event.title}</Card.Title>
          <Card.Text>{event.description || 'Join us for an exciting event you will never forget.'}</Card.Text>
          <Link href={`/event/${event._id || `sample-event-${index + 1}`}`} passHref>
            <Button variant="primary">View Details</Button>
          </Link>
        </Card.Body>
      </Card>
    </Col>
  );
}

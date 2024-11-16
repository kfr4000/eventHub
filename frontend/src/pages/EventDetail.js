// frontend/src/pages/EventDetail.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { joinEvent, fetchEvent } from '../utils/api';
import { Card, Button, Container } from 'react-bootstrap';

export default function EventDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const loadEvent = async () => {
      if (id) {
        try {
          const data = await fetchEvent(id);
          setEvent(data);
        } catch {
          setMessage('Failed to load event');
        }
      }
    };
    loadEvent();
  }, [id]);

  const handleJoinEvent = async () => {
    try {
      await joinEvent(id);
      setMessage('You have successfully joined the event!');
    } catch {
      setMessage('Failed to join the event');
    }
  };

  if (message) {
    return <p>{message}</p>;
  }

  return (
    <Container className="my-4">
      {event ? (
        <>
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
              <Button variant="primary" onClick={handleJoinEvent}>
                Join Event
              </Button>
            </Card.Body>
          </Card>
        </>
      ) : (
        <p>Loading event details...</p>
      )}
    </Container>
  );
}

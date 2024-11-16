import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { joinEvent, fetchEvent } from '../utils/api';
import { Card, Button, Container } from 'react-bootstrap';

export default function EventDetail() {
  const router = useRouter();
  const { id } = router.query; // URL 파라미터에서 이벤트 ID를 가져옵니다.
  const [event, setEvent] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!id) return; // id가 아직 없는 경우에는 아무 작업도 하지 않습니다.
    
    const loadEvent = async () => {
      try {
        const data = await fetchEvent(id);
        setEvent(data);
      } catch {
        setMessage('Failed to load event details.');
      }
    };
    loadEvent();
  }, [id]);

  const handleJoinEvent = async () => {
    setMessage(null);

    const token = localStorage.getItem('token'); // 로그인한 사용자의 토큰 가져오기
    if (!token) {
      setMessage('Please log in to join the event.');
      return;
    }

    try {
      const data = await joinEvent(id, token);
      setMessage(data.message);
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (!event) {
    return <p>Loading...</p>;
  }

  return (
    <Container className="my-4">
      <Card>
        <Card.Body>
          <Card.Title>{event.name}</Card.Title>
          <Card.Text>{event.description}</Card.Text>
          <Card.Text>
            <strong>Date: </strong>
            {new Date(event.date).toLocaleDateString()}
          </Card.Text>
          <Card.Text>
            <strong>Location: </strong>
            {event.location}
          </Card.Text>
          <Button variant="success" onClick={handleJoinEvent}>
            Join Event
          </Button>
          {message && <p className="mt-3">{message}</p>}
        </Card.Body>
      </Card>
    </Container>
  );
}

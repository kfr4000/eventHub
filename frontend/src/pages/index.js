// frontend/src/pages/index.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchEvents = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL;
      console.log('Fetching events from URL:', url); // Debugging line
      if (!url) {
        throw new Error('API URL is not defined');
      }
      const response = await axios.get(`${url}/events`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setMessage(error.response?.data?.message || 'Error fetching events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <Container>
      <h1 className="my-4">Events</h1>
      {message && <Alert variant="danger">{message}</Alert>}
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <Row>
          {events.map((event) => (
            <Col key={event._id} md={4}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>{event.title}</Card.Title>
                  <Card.Text>{event.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Home;

// frontend/src/pages/index.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert, Button, Form, Jumbotron } from 'react-bootstrap';
import Link from 'next/link';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchEvents = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL;
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
    if (!process.env.NEXT_PUBLIC_API_URL) {
      setMessage('API URL is not defined');
      setLoading(false);
      return;
    }
    fetchEvents();
  }, []);

  return (
    <Container>
      <Jumbotron className="my-4 text-center">
        <h1>Welcome to EventHub</h1>
        <p>Discover and join amazing events happening around you.</p>
        <Link href="/create-event" passHref>
          <Button variant="primary">Create Event</Button>
        </Link>
      </Jumbotron>
      <Row className="my-4">
        <Col>
          <h1>Find your next event</h1>
          <Form>
            <Form.Group controlId="search">
              <Form.Control type="text" placeholder="Search for events" />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-2">
              Search
            </Button>
          </Form>
        </Col>
      </Row>
      <h2 className="my-4">Featured Events</h2>
      {message && <Alert variant="danger">{message}</Alert>}
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : events.length === 0 ? (
        <Alert variant="info">No events available</Alert>
      ) : (
        <Row>
          {events.map((event) => (
            <Col key={event._id} md={4}>
              <Card className="mb-4">
                <Card.Img variant="top" src={event.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'} />
                <Card.Body>
                  <Card.Title>{event.title}</Card.Title>
                  <Card.Text>{event.description}</Card.Text>
                  <Link href={`/event/${event._id}`} passHref>
                    <Button variant="primary">View Details</Button>
                  </Link>
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

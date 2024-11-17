// frontend/src/pages/index.js

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Button, Row, Col, Navbar, Form, FormControl, Carousel, Nav, Dropdown, Spinner } from 'react-bootstrap';
import Image from 'next/image';
import EventCard from '../components/EventCard';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventType, setEventType] = useState('');
  const [location, setLocation] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/events`);
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchEvents();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`);
            if (!response.ok) throw new Error('Failed to fetch location');
            const data = await response.json();
            setLocation(data.address?.city || 'Tokyo');
          } catch {
            setLocation('Tokyo');
          }
        },
        () => setLocation('Tokyo')
      );
    } else {
      setLocation('Tokyo');
    }
  }, [fetchEvents]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/events?search=${searchTerm}&type=${eventType}&location=${location}`);
      if (!response.ok) throw new Error('Failed to fetch search results');
      const data = await response.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

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
    <Container>
      <Navbar bg="light" expand="lg" className="sticky-top">
        <Container>
          <Navbar.Brand href="/">EventHub</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Find Events</Nav.Link>
              <Nav.Link href="/CreateEvent">Create Events</Nav.Link>
            </Nav>
            <Form className="d-flex" onSubmit={handleSearch}>
              <FormControl
                type="search"
                placeholder="Search for events"
                className="me-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FormControl
                type="text"
                placeholder="Location"
                className="me-2"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <Dropdown onSelect={setEventType} className="me-2">
                <Dropdown.Toggle variant="outline-secondary">
                  {eventType || 'Event Type'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {['', 'Music', 'Nightlife', 'Arts', 'Sports', 'Business', 'Food'].map((type) => (
                    <Dropdown.Item key={type} eventKey={type}>{type || 'All'}</Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <Button variant="outline-success" type="submit">Search</Button>
            </Form>
            <Nav>
              <Nav.Link href="/login" className="ms-3">Log In</Nav.Link>
              <Nav.Link href="/register" className="ms-2">Sign Up</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Carousel className="my-4">
        {['Autumn Fairs & Festivals', 'Supper Club Parties', 'Stay Connected with Local Events'].map((caption, index) => (
          <Carousel.Item key={index}>
            <Image
              className="d-block w-100"
              src={`https://via.placeholder.com/1200x400?text=${caption.replace(/\s/g, '+')}`}
              alt={`${caption} slide`}
              width={1200}
              height={400}
            />
            <Carousel.Caption>
              <h3>{caption}</h3>
              <p>Enjoy the best {caption.toLowerCase()} this season.</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      <h2>Explore Events by Category</h2>
      <Row className="text-center my-4">
        {['Music', 'Nightlife', 'Arts', 'Sports', 'Business', 'Food'].map((category) => (
          <Col key={category} md={2} className="mb-4">
            <div className="event-category-icon">
              <Image src={`https://via.placeholder.com/100?text=${category}`} alt={category} width={100} height={100} />
              <h5>{category}</h5>
            </div>
          </Col>
        ))}
      </Row>

      <h2>Recommended for You</h2>
      <Row>
        {events.slice(0, 3).map((event, index) => (
          <EventCard key={event._id || index} event={event} index={index} />
        ))}
      </Row>

      <h2>Upcoming Events</h2>
      <Row>
        {events.length > 0 ? (
          events.map((event, index) => (
            <EventCard key={event._id || index} event={event} index={index} />
          ))
        ) : (
          Array.from({ length: 6 }).map((_, index) => (
            <EventCard key={index} event={{ title: `Sample Event ${index + 1}`, description: "Join us for an exciting event you will never forget." }} index={index} />
          ))
        )}
      </Row>
    </Container>
  );
}

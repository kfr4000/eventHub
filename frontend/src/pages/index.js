// frontend/src/pages/index.js

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Button, Row, Col, Navbar, Form, FormControl, Carousel, Nav, Dropdown } from 'react-bootstrap';
import Image from 'next/image';
import EventCard from '../components/EventCard';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventType, setEventType] = useState('');
  const [location, setLocation] = useState('');

  // API URL 설정
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // 이벤트 목록 가져오기 함수 (useCallback으로 메모이제이션)
  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/events`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchEvents();

    // 사용자의 위치 자동 감지
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
            if (!response.ok) {
              throw new Error('Failed to fetch location');
            }
            const data = await response.json();
            if (data.address && data.address.city) {
              setLocation(data.address.city);
            } else {
              setLocation('Tokyo'); // 기본값으로 도쿄 설정
            }
          } catch (error) {
            console.error('Error fetching location:', error);
            setLocation('Tokyo'); // 기본값으로 도쿄 설정
          }
        },
        (error) => {
          console.error('Error getting geolocation:', error);
          setLocation('Tokyo'); // 기본값으로 도쿄 설정
        }
      );
    } else {
      setLocation('Tokyo'); // 기본값으로 도쿄 설정
    }
  }, [fetchEvents]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/events?search=${searchTerm}&type=${eventType}&location=${location}`);
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      const data = await response.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleEventTypeChange = (type) => {
    setEventType(type);
  };

  return (
    <div>
      <Navbar bg="light" expand="lg" className="sticky-top">
        <Container>
          <Navbar.Brand href="/">EventHub</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Find Events</Nav.Link>
              <Nav.Link href="/CreateEvent">Create Events</Nav.Link>
              <Nav.Link href="#">Help Center</Nav.Link>
            </Nav>
            <Form className="d-flex" onSubmit={handleSearch}>
              <FormControl
                type="search"
                placeholder="Search for events"
                className="me-2"
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FormControl
                type="text"
                placeholder="Location"
                className="me-2"
                aria-label="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <Dropdown onSelect={handleEventTypeChange} className="me-2">
                <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                  {eventType || 'Event Type'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="">All</Dropdown.Item>
                  <Dropdown.Item eventKey="Music">Music</Dropdown.Item>
                  <Dropdown.Item eventKey="Nightlife">Nightlife</Dropdown.Item>
                  <Dropdown.Item eventKey="Arts">Arts & Theatre</Dropdown.Item>
                  <Dropdown.Item eventKey="Sports">Sports</Dropdown.Item>
                  <Dropdown.Item eventKey="Business">Business</Dropdown.Item>
                  <Dropdown.Item eventKey="Food">Food & Drink</Dropdown.Item>
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

      {/* 메인 배너 슬라이드 */}
      <Carousel className="my-4">
        <Carousel.Item>
          <Image
            className="d-block w-100"
            src="https://via.placeholder.com/1200x400?text=Autumn+Fairs+%26+Festivals"
            alt="First slide"
            width={1200}
            height={400}
          />
          <Carousel.Caption>
            <h3>Autumn Fairs & Festivals</h3>
            <p>Enjoy the best festivals this season.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <Image
            className="d-block w-100"
            src="https://via.placeholder.com/1200x400?text=Supper+Club+Parties"
            alt="Second slide"
            width={1200}
            height={400}
          />
          <Carousel.Caption>
            <h3>Supper Club Parties</h3>
            <p>Join us for amazing supper club experiences.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <Image
            className="d-block w-100"
            src="https://via.placeholder.com/1200x400?text=Stay+Connected+with+Local+Events"
            alt="Third slide"
            width={1200}
            height={400}
          />
          <Carousel.Caption>
            <h3>Stay Connected with Local Events</h3>
            <p>Never miss out on what&apos;s happening around you.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {/* 탐색 섹션 */}
      <Container className="my-4">
        <h2>Explore Events by Category</h2>
        <Row className="text-center">
          <Col md={2} className="mb-4">
            <div className="event-category-icon">
              <Image src="https://via.placeholder.com/100?text=Music" alt="Music" className="mb-2" width={100} height={100} />
              <h5>Music</h5>
            </div>
          </Col>
          <Col md={2} className="mb-4">
            <div className="event-category-icon">
              <Image src="https://via.placeholder.com/100?text=Nightlife" alt="Nightlife" className="mb-2" width={100} height={100} />
              <h5>Nightlife</h5>
            </div>
          </Col>
          <Col md={2} className="mb-4">
            <div className="event-category-icon">
              <Image src="https://via.placeholder.com/100?text=Arts" alt="Arts & Theatre" className="mb-2" width={100} height={100} />
              <h5>Arts & Theatre</h5>
            </div>
          </Col>
          <Col md={2} className="mb-4">
            <div className="event-category-icon">
              <Image src="https://via.placeholder.com/100?text=Sports" alt="Sports" className="mb-2" width={100} height={100} />
              <h5>Sports</h5>
            </div>
          </Col>
          <Col md={2} className="mb-4">
            <div className="event-category-icon">
              <Image src="https://via.placeholder.com/100?text=Business" alt="Business" className="mb-2" width={100} height={100} />
              <h5>Business</h5>
            </div>
          </Col>
          <Col md={2} className="mb-4">
            <div className="event-category-icon">
              <Image src="https://via.placeholder.com/100?text=Food" alt="Food & Drink" className="mb-2" width={100} height={100} />
              <h5>Food & Drink</h5>
            </div>
          </Col>
        </Row>
      </Container>

      {/* 추천 이벤트 섹션 */}
      <Container className="my-4">
        <h2>Recommended for You</h2>
        <Row>
          {Array.isArray(events) && events.slice(0, 3).map((event, index) => (
            <EventCard key={event._id || index} event={event} index={index} />
          ))}
        </Row>
      </Container>

      {/* 진행 중인 이벤트 섹션 */}
      <Container className="my-4">
        <h2>Upcoming Events</h2>
        <Row>
          {Array.isArray(events) && events.length > 0 ? (
            events.map((event, index) => (
              <EventCard key={event._id || index} event={event} index={index} />
            ))
          ) : (
            // 예시 이벤트 카드 표시
            Array.from({ length: 6 }).map((_, index) => (
              <EventCard key={index} event={{ title: `Sample Event ${index + 1}`, description: "Join us for an exciting event you will never forget." }} index={index} />
            ))
          )}
        </Row>
      </Container>
    </div>
  );
}

// frontend/src/components/Navbar.js

import React from 'react';
import { Navbar, Container, Nav, Form, FormControl, Dropdown, Button } from 'react-bootstrap';

export default function NavbarComponent({ handleSearch, searchTerm, setSearchTerm, location, setLocation, eventType, setEventType }) {
  return (
    <Navbar bg="light" expand="lg" className="sticky-top">
      <Container fluid>
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
            <Dropdown onSelect={(eventKey) => setEventType(eventKey)} className="me-2">
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
  );
}

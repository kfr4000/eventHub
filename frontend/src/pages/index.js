// frontend/src/pages/index.js

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Spinner } from 'react-bootstrap';
import EventCard from '../components/EventCard';
import NavbarComponent from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import CategorySection from '../components/CategorySection';
import DiscoverSection from '../components/DiscoverSection';

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
    <Container fluid>
      <NavbarComponent handleSearch={handleSearch} searchTerm={searchTerm} setSearchTerm={setSearchTerm} location={location} setLocation={setLocation} eventType={eventType} setEventType={setEventType} />
      <HeroSection />
      <div className="featured-events-section py-4">
        <h2 className="mb-4">Upcoming Events</h2>
        <Row>
          {events.length > 0 ? (
            events.map((event, index) => (
              <EventCard key={event._id || index} event={event} index={index} />
            ))
          ) : (
            <p>No events available at the moment.</p>
          )}
        </Row>
      </div>
      <CategorySection />
      <DiscoverSection />
    </Container>
  );
}

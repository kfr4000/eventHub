// frontend/src/components/HeroSection.js

import React from 'react';
import { Container, Button } from 'react-bootstrap';

export default function HeroSection() {
  return (
    <div className="hero-section bg-light text-center py-5">
      <Container>
        <h1 className="display-4">Discover Amazing Events Near You</h1>
        <p className="lead">Explore, Join, and Create Memorable Experiences.</p>
        <Button variant="primary" size="lg">Explore Events</Button>
      </Container>
    </div>
  );
}

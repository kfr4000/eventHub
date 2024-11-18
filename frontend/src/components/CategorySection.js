// frontend/src/components/CategorySection.js

import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';

export default function CategorySection() {
  return (
    <Container className="category-section my-4">
      <h2 className="mb-4">Explore Events by Category</h2>
      <Row className="text-center">
        {['Music', 'Nightlife', 'Arts', 'Sports', 'Business', 'Food'].map((category) => (
          <Col key={category} md={2} className="mb-4">
            <div className="event-category-icon">
              <Image src={`https://via.placeholder.com/100?text=${category}`} alt={category} width={100} height={100} />
              <h5>{category}</h5>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

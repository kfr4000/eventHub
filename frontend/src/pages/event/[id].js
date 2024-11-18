// frontend/src/pages/event/[id].js

import React from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import EventDetail from '../../pages/EventDetail'; // Correct the import path

const EventPage = () => {
  const router = useRouter();
  const { id } = router.query;

  // Fetch event details using the id   

  return <EventDetail />;
};

export default EventPage;

import { useState, useEffect } from 'react';
import { getUserHostedEvents, getUserJoinedEvents } from '../utils/api';

export default function MyEvents() {
  const [hostedEvents, setHostedEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      setMessage(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Please log in to view your events.');
        return;
      }

      try {
        const hostedData = await getUserHostedEvents(token);
        const joinedData = await getUserJoinedEvents(token);
        setHostedEvents(hostedData);
        setJoinedEvents(joinedData);
      } catch (error) {
        setMessage(error.message);
      }
    };

    loadEvents();
  }, []);

  return (
    <div>
      <h1>My Events</h1>
      {message && <p>{message}</p>}

      <h2>Hosted Events</h2>
      {hostedEvents.length === 0 && <p>No hosted events found.</p>}
      <ul>
        {hostedEvents.map((event) => (
          <li key={event._id}>{event.name} - {new Date(event.date).toLocaleDateString()}</li>
        ))}
      </ul>

      <h2>Joined Events</h2>
      {joinedEvents.length === 0 && <p>No joined events found.</p>}
      <ul>
        {joinedEvents.map((event) => (
          <li key={event._id}>{event.name} - {new Date(event.date).toLocaleDateString()}</li>
        ))}
      </ul>
    </div>
  );
}

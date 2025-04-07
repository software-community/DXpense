import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CreateTrip from '../components/CreateTrip';
import '../styles/Home.css';

const Home = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch trips from localStorage
    const fetchTrips = () => {
      try {
        const storedTrips = JSON.parse(localStorage.getItem('trips') || '[]');
        // Sort trips by date (newest first)
        const sortedTrips = [...storedTrips].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setTrips(sortedTrips);
      } catch (error) {
        console.error('Error fetching trips:', error);
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  // Get the 3 most recent trips
  const recentTrips = trips.slice(0, 3);

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">Welcome to dXpense</h1>
        <p className="home-subtitle">Track and split expenses with friends and family</p>
      </div>

      <CreateTrip />

      <div className="recent-trips-section">
        <div className="section-header">
          <h2 className="section-title">Recent Trips</h2>
          <Link to="/all-trips" className="view-all-link">View All Trips</Link>
        </div>

        {loading ? (
          <div className="loading-message">Loading trips...</div>
        ) : recentTrips.length > 0 ? (
          <div className="trips-grid">
            {recentTrips.map((trip) => (
              <Link to={`/trip/${trip.id}`} key={trip.id} className="trip-card">
                <div className="trip-card-header">
                  <h3 className="trip-name">{trip.name}</h3>
                  <span className={`trip-status ${trip.status}`}>
                    {trip.status === 'settled' ? 'Settled' : 'Active'}
                  </span>
                </div>
                <div className="trip-card-content">
                  <div className="trip-info">
                    <span className="trip-date">{trip.date}</span>
                    <span className="trip-participants">
                      {trip.participants.length} {trip.participants.length === 1 ? 'participant' : 'participants'}
                    </span>
                  </div>
                  {trip.description && (
                    <p className="trip-description">{trip.description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="no-trips-message">
            <p>You haven't created any trips yet.</p>
            <p>Create your first trip above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

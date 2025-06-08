import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CreateTrip from '../components/CreateTrip';
import '../styles/Home.css';
import { initialize_contract, get_names, get_trips } from '../components/ContractActions';

const Home = ({contract}) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch trips from localStorage

    const fetchTrips = async() => {
      if(!contract) {
        console.warn('Contract not initialized yet, skipping trip fetch.');
        return;
      }
      try {
        const storedTrips = await get_trips(contract);
        console.log('Fetched trips:', storedTrips);
        setTrips(storedTrips);
      } catch (error) {
        console.error('Error fetching trips:', error);
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [contract]);

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
              <Link to={`/trip/${trip.trip_id}`} key={trip.trip_id} className="trip-card">
                <div className="trip-card-header">
                  <h3 className="trip-name">{trip.name}</h3>
                  <span className={`trip-status ${trip.status}`}>
                    {trip.debts.length === 0 ? 'Settled' : 'Active'}
                  </span>
                </div>
                <div className="trip-card-content">
                  <div className="trip-info">
                    <span className="trip-participants">
                      {trip.people.length} {trip.people.length === 1 ? 'participant' : 'participants'}
                    </span>
                  </div>
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

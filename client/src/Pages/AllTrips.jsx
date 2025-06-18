import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/AllTrips.css';
import { get_user_trip_ids, get_trip } from '../components/ContractActions';

const AllTrips = ({ contract, account }) => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'settled'
  const [loading, setLoading] = useState(true);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      if (!contract) {
        setTrips([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const tripIds = await get_user_trip_ids(contract);
        const tripDetails = await Promise.all(
          tripIds.map(async (id) => {
            const trip = await get_trip(contract, id);
            // trip: [trip_id, name, people[], expenseIds[], debtIds[]]
            return {
              id: trip[0].toString(),
              name: trip[1],
              participants: trip[2],
              expenseIds: trip[3],
              debts: trip[4],
              status: trip[4].length === 0 ? 'settled' : 'active',
              date: '', // If you want to add a date, you can extend your contract
              description: '', // If you want to add a description, you can extend your contract
            };
          })
        );
        // Sort by trip id (newest first)
        tripDetails.sort((a, b) => Number(b.id) < Number(a.id) ? 1 : -1);
        setTrips(tripDetails);
      } catch (error) {
        console.error('Error fetching trips:', error);
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [contract, account]);

  // Filter trips based on selected filter
  const filteredTrips = trips.filter(trip => {
    if (filter === 'all') return true;
    return trip.status === filter;
  });

  // Delete functionality is not supported on-chain, so we just hide the button
  // and remove localStorage logic.

  return (
    <div className="all-trips-container">
      <div className="all-trips-header">
        <div className="header-content">
          <Link to="/" className="back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Home
          </Link>
          <h1 className="page-title">All Trips</h1>
        </div>
        
        <div className="filter-controls">
          <button 
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-button ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button 
            className={`filter-button ${filter === 'settled' ? 'active' : ''}`}
            onClick={() => setFilter('settled')}
          >
            Settled
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-message">Loading trips...</div>
      ) : filteredTrips.length > 0 ? (
        <div className="trips-grid">
          {filteredTrips.map((trip) => (
            <div key={trip.id} className="trip-card">
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
                <div className="trip-card-actions">
                  <Link 
                    to={`/trip/${trip.id}`} 
                    className="btn btn-primary"
                  >
                    View Details
                  </Link>
                  {/* Delete is not supported on-chain */}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-trips-message">
          <p>No {filter !== 'all' ? filter : ''} trips found.</p>
          {filter !== 'all' && (
            <button 
              className="btn btn-primary"
              onClick={() => setFilter('all')}
            >
              View All Trips
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AllTrips;
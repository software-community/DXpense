import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/AllTrips.css';

const AllTrips = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'settled'
  const [loading, setLoading] = useState(true);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);

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

  // Filter trips based on selected filter
  const filteredTrips = trips.filter(trip => {
    if (filter === 'all') return true;
    return trip.status === filter;
  });

  const handleDeleteClick = (e, trip) => {
    e.preventDefault(); // Prevent navigation to trip details
    setTripToDelete(trip);
    setShowDeletePrompt(true);
  };

  const handleDeleteTrip = () => {
    if (!tripToDelete) return;

    // Remove trip from localStorage
    const updatedTrips = trips.filter(t => t.id !== tripToDelete.id);
    localStorage.setItem('trips', JSON.stringify(updatedTrips));
    
    // Remove trip's expenses from localStorage
    const allExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    const updatedExpenses = allExpenses.filter(expense => expense.tripId !== tripToDelete.id);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    
    // Update state
    setTrips(updatedTrips);
    setShowDeletePrompt(false);
    setTripToDelete(null);
  };

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

      {showDeletePrompt && tripToDelete && (
        <div className="delete-trip-prompt">
          <h3>Delete Trip?</h3>
          <p>Are you sure you want to delete <strong>{tripToDelete.name}</strong>?</p>
          <p className="warning-text">This will permanently delete the trip and all its expenses. This action cannot be undone.</p>
          <div className="prompt-actions">
            <button 
              className="btn btn-secondary"
              onClick={() => {
                setShowDeletePrompt(false);
                setTripToDelete(null);
              }}
            >
              Cancel
            </button>
            <button 
              className="btn btn-danger"
              onClick={handleDeleteTrip}
            >
              Delete Trip
            </button>
          </div>
        </div>
      )}

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
                  <button 
                    className="btn btn-danger"
                    onClick={(e) => handleDeleteClick(e, trip)}
                  >
                    Delete Trip
                  </button>
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
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/design-system.css';
import '../styles/CreateTrip.css';

const CreateTrip = () => {
  const navigate = useNavigate();
  const [tripName, setTripName] = useState('');
  const [participants, setParticipants] = useState([]);
  const [newParticipant, setNewParticipant] = useState('');
  const [tripDate, setTripDate] = useState('');
  const [tripDescription, setTripDescription] = useState('');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create a new trip object
    const newTrip = {
      id: Date.now().toString(), // Simple unique ID
      name: tripName,
      date: formatDate(tripDate),
      description: tripDescription,
      participants: participants,
      status: 'active',
      createdAt: new Date().toLocaleDateString(),
      totalExpenses: 0,
      participantBalances: {},
      expenses: []
    };
    
    // Get existing trips from localStorage
    const existingTrips = JSON.parse(localStorage.getItem('trips') || '[]');
    
    // Add the new trip to the array
    const updatedTrips = [...existingTrips, newTrip];
    
    // Save back to localStorage
    localStorage.setItem('trips', JSON.stringify(updatedTrips));
    
    // Redirect to the trip details page
    navigate(`/trip/${newTrip.id}`);
  };

  const handleAddParticipant = (e) => {
    e.preventDefault();
    if (newParticipant.trim()) {
      setParticipants([...participants, newParticipant.trim()]);
      setNewParticipant('');
    }
  };

  const removeParticipant = (index) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  return (
    <div className="card create-trip-card">
      <div className="create-trip-accent-bar"></div>
      
      <div className="create-trip-header">
        <div className="create-trip-icon">+</div>
        <h2 className="create-trip-title">Create a New Trip</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="create-trip-form">
        <div className="form-field-full">
          <label htmlFor="tripName" className="form-label">
            Trip Name
          </label>
          <input
            id="tripName"
            type="text"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            className="input form-input"
            placeholder="Enter trip name..."
            required
          />
        </div>

        <div>
          <label htmlFor="tripDate" className="form-label">
            Trip Date
          </label>
          <input
            id="tripDate"
            type="date"
            value={tripDate}
            onChange={(e) => setTripDate(e.target.value)}
            className="input form-input"
            required
          />
        </div>

        <div>
          <label htmlFor="participants" className="form-label">
            Add Participants
          </label>
          <div className="participant-input-container">
            <input
              id="participants"
              type="text"
              value={newParticipant}
              onChange={(e) => setNewParticipant(e.target.value)}
              className="input form-input"
              placeholder="Add participant..."
            />
            <button
              type="button"
              onClick={handleAddParticipant}
              className="btn btn-primary add-participant-button"
            >
              Add
            </button>
          </div>
        </div>

        <div className="form-field-full">
          <label htmlFor="tripDescription" className="form-label">
            Trip Description (Optional)
          </label>
          <textarea
            id="tripDescription"
            value={tripDescription}
            onChange={(e) => setTripDescription(e.target.value)}
            className="input form-textarea"
            placeholder="Enter trip description..."
            rows="3"
          />
        </div>

        {participants.length > 0 && (
          <div className="participants-container">
            <h3 className="participants-title">
              Participants ({participants.length})
            </h3>
            <div className="participants-list">
              {participants.map((participant, index) => (
                <span key={index} className="participant-tag">
                  {participant}
                  <button
                    type="button"
                    onClick={() => removeParticipant(index)}
                    className="remove-participant-button"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="submit-button-container">
          <button type="submit" className="btn btn-primary submit-button">
            <span>Create Trip</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTrip;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/design-system.css';
import '../styles/CreateTrip.css';
import { add_trip, add_person } from './ContractActions';
import { isAddress } from 'ethers'
import Lock from '../Lock.json'; 

const CreateTrip = ({ contract, account }) => {
  const navigate = useNavigate();
  const [tripName, setTripName] = useState('');
  const [participants, setParticipants] = useState([]);
  const [newParticipantName, setNewParticipantName] = useState('');
  const [newParticipantAddress, setNewParticipantAddress] = useState('');
  const [tripDate, setTripDate] = useState('');
  const [tripDescription, setTripDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ownerName, setOwnerName] = useState('');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleAddParticipant = (e) => {
    e.preventDefault();
    if (!isAddress(newParticipantAddress.trim())) {
      setError('Invalid Ethereum address.');
      return;
    }
    if (!newParticipantName.trim() || !newParticipantAddress.trim()) {
      setError('Both name and address are required.');
      return;
    }
    setParticipants([
      ...participants,
      { name: newParticipantName.trim(), address: newParticipantAddress.trim() }
    ]);
    setNewParticipantName('');
    setNewParticipantAddress('');
    setError('');
  };

  const removeParticipant = (index) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!contract) {
        setError('Smart contract not connected.');
        setLoading(false);
        return;
      }
      if (!tripName.trim()) {
        setError('Trip name is required.');
        setLoading(false);
        return;
      }
      if (!ownerName.trim()) {
        setError('Owner name is required.');
        setLoading(false);
        return;
      }
      const receipt = await add_trip(contract, tripName, ownerName);

    // Extract the tripId from the TripCreated event
    let tripId;
    for (const log of receipt.logs) {
      try {
        const parsed = contract.interface.parseLog(log);
        if (parsed.name === "TripCreated") {
          tripId = parsed.args.tripId.toString();
          break;
        }
      } catch (err) {
        // Not this event, skip
      }
    }

    if (!tripId) {
      setError('Could not determine new trip ID.');
      setLoading(false);
      return;
    }

    // Add each participant to the trip
    for (const participant of participants) {
      await add_person(contract, tripId, participant.address, participant.name);
    }

      // Add participants after trip creation (code for this will be added in the next step)
      navigate('/all-trips');
    } catch (err) {
      setError('Failed to create trip: ' + (err?.message || err));
    } finally {
      setLoading(false);
    }
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

        <div className="form-field-full">
          <label htmlFor="ownerName" className="form-label">
            Owner Name
          </label>
          <input
            id="ownerName"
            type="text"
            value={ownerName}
            onChange={e => setOwnerName(e.target.value)}
            className="input form-input"
            placeholder="Enter your name..."
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
          <label className="form-label">Add Participants</label>
          <div className="participant-input-container" style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={newParticipantName}
              onChange={(e) => setNewParticipantName(e.target.value)}
              className="input form-input"
              placeholder="Name"
            />
            <input
              type="text"
              value={newParticipantAddress}
              onChange={(e) => setNewParticipantAddress(e.target.value)}
              className="input form-input"
              placeholder="Address"
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
                  {participant.name} ({participant.address})
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

        {error && <div className="error-message">{error}</div>}

        <div className="submit-button-container">
          <button type="submit" className="btn btn-primary submit-button" disabled={loading}>
            <span>{loading ? "Creating..." : "Create Trip"}</span>
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
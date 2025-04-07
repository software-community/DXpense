import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/design-system.css';

const TripCard = ({ trip }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/trip/${trip.id}`);
  };

  return (
    <div className="card" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 'var(--spacing-md)',
      position: 'relative'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: '1.25rem', 
          color: 'var(--text-dark)' 
        }}>
          {trip.name}
        </h3>
        <span style={{ 
          color: 'var(--secondary-color)',
          fontSize: '0.875rem'
        }}>
          {trip.date || 'No date set'}
        </span>
      </div>
      
      <div style={{ 
        display: 'flex', 
        gap: 'var(--spacing-sm)',
        flexWrap: 'wrap'
      }}>
        {trip.participants?.map((participant, index) => (
          <span 
            key={index}
            style={{
              background: 'var(--background-light)',
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem'
            }}
          >
            {participant}
          </span>
        ))}
      </div>

      <div style={{ 
        display: 'flex', 
        gap: 'var(--spacing-sm)',
        marginTop: 'auto'
      }}>
        <button 
          className="btn btn-primary"
          onClick={handleEdit}
          style={{ flex: 1 }}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default TripCard;

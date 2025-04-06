import React from 'react'

const TripCard = ({trip}) => {
  return (
    <div className="tripCard">
        <div className="trip-poster">{trip.name}</div>
        <button className="edit-btn">Edit</button>
    </div>
  )
}

export default TripCard

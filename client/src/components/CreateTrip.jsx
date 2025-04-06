import React from 'react'

const CreateTrip = () => {
  return (
    <div className="createBox">
        <div className="createTrip">Create a Trip</div>
        <form className="create-form">
        <input
          type="text"
          placeholder="Enter name of Trip..."
          className="create-input"
        />
        <button type="submit" className="add-button">
          Add
        </button>
      </form>
    </div>
  )
}

export default CreateTrip

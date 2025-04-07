import React, { useState } from 'react'
import './App.css'
import { Routes, Route } from "react-router-dom";
import NavBar from './components/NavBar'
import Home from './Pages/Home'
import AddExpense from './Pages/AddExpense';
import AllTrips from './Pages/AllTrips';
import TripDetails from './Pages/TripDetails';
import './styles/design-system.css';

function App() {
  const [account, setAccount] = useState(null);

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'var(--background-light)',
      color: 'var(--text-dark)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <NavBar account={account} setAccount={setAccount} />
      <main style={{ 
        flex: 1,
        width: '100%',
        padding: 'var(--spacing-xl) 0'
      }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/addExpense" element={<AddExpense />} />
          <Route path="/all-trips" element={<AllTrips />} />
          <Route path="/trip/:tripId" element={<TripDetails />} />
        </Routes>
      </main>
    </div>
  )
}

export default App

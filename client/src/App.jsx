import React, { useState, useEffect } from 'react'
import './App.css'
import { Routes, Route } from "react-router-dom";
import NavBar from './components/NavBar'
import Home from './Pages/Home'
import AddExpense from './Pages/AddExpense';
import AllTrips from './Pages/AllTrips';
import TripDetails from './Pages/TripDetails';
import './styles/design-system.css';
import { initialize_contract } from './components/ContractActions';

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this app.");
      return;
    }
  }, []);

  useEffect(() => {
    // Initialize the contract when the component mounts
    const initContract = async () => {
      try {
        let contractInstance = await initialize_contract();
        setContract(contractInstance);
        console.log('Contract initialized:', contractInstance);
      } catch (error) {
        console.error('Error initializing contract:', error);
      }
    };

    initContract();
  }, []);

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
        {contract ? (
          <Routes>
            <Route path="/" element={<Home contract={contract}/>} />
            <Route path="/addExpense" element={<AddExpense contract={contract}/>} />
            <Route path="/all-trips" element={<AllTrips contract={contract}/>} />
            <Route path="/trip/:tripId" element={<TripDetails contract={contract}/>} />
          </Routes>
        ) : (
          <div>Loading contract...</div>
        )}
      </main>
    </div>
  )
}

export default App

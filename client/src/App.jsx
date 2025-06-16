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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this app.");
      return;
    }
  }, []);

useEffect(() => {
  const autoConnect = async () => {
    setLoading(true);
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        const contractInstance = await initialize_contract();
        setContract(contractInstance);
      }
    }
    setLoading(false);
  };
  autoConnect();
}, []);

useEffect(() => {
  if (window.ethereum) {
    const handleAccountsChanged = (accounts) => {
      setAccount(accounts[0] || null);
      // Optionally re-initialize contract or reload data here
    };
    window.ethereum.on('accountsChanged', handleAccountsChanged);

    // Cleanup on unmount
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }
}, []);

if (loading) {
  return <div>Loading...</div>;
}

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
        {contract && account ? (
          <Routes>
            <Route path="/" element={<Home contract={contract} account={account}/>} />
            <Route path="/addExpense" element={<AddExpense contract={contract} account={account}/>} />
            <Route path="/all-trips" element={<AllTrips contract={contract} account={account}/>} />
            <Route path="/trip/:tripId" element={<TripDetails contract={contract} account={account}/>} />
          </Routes>
        ) : (
          <div>Loading contract...</div>
        )}
      </main>
    </div>
  )
}

export default App

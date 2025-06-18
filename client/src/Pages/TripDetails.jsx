import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AddExpense from '../components/AddExpense';
import '../styles/TripDetails.css';
import { get_trip, get_expense, get_person, add_person, get_debt, settle_debt } from '../components/ContractActions';
import { isAddress } from 'ethers';

const TripDetails = ({ contract, account }) => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [participantNames, setParticipantNames] = useState([]);
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [newParticipantName, setNewParticipantName] = useState('');
  const [newParticipantAddress, setNewParticipantAddress] = useState('');
  const [addParticipantError, setAddParticipantError] = useState('');
  const [addingParticipant, setAddingParticipant] = useState(false);
  const [addressToName, setAddressToName] = useState({});
  const [debts, setDebts] = useState([]);

  useEffect(() => {
    const fetchTripDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!contract) {
          setError('Smart contract not connected.');
          setLoading(false);
          return;
        }
        // Fetch trip details from contract
        const tripData = await get_trip(contract, tripId);
        if (!tripData) {
          setError('Trip not found');
          setLoading(false);
          return;
        }
        setTrip(tripData);

        // Fetch participant names
        const participantAddresses = tripData[2];
        const participantNames = await Promise.all(
          participantAddresses.map(async (addr) => {
            try {
              const [, name] = await get_person(contract, addr);
              return name || addr;
            } catch {
              return addr;
            }
          })
        );
        setParticipantNames(participantNames);

        // Fetch all expenses for this trip
        const expenseIds = tripData[3];
        const expenseDetails = await Promise.all(
          expenseIds.map(async (eid) => {
            try {
              const exp = await get_expense(contract, eid);
              return {
                id: exp[0].toString(),
                amount: Number(exp[1]),
                name: exp[2],
                expender: exp[3],
                people_involved: exp[4],
              };
            } catch {
              return null;
            }
          })
        );
        const filteredExpenses = expenseDetails.filter(Boolean);
        setExpenses(filteredExpenses);

        const debtIds = tripData[4];
        const debtDetails = await Promise.all(
          debtIds.map(async (did) => {
            try {
              const debt = await get_debt(contract, did);
              // debt: [debt_id, debtor, creditor, amount]
              return {
                id: debt[0].toString(),
                debtor: debt[1],
                creditor: debt[2],
                amount: Number(debt[3]),
              };
            } catch {
              return null;
            }
          })
        );
        setDebts(debtDetails.filter(Boolean));

        // Collect all unique addresses (expender + people_involved)
        const allAddresses = new Set();
        filteredExpenses.forEach(exp => {
          allAddresses.add(exp.expender);
          exp.people_involved.forEach(addr => allAddresses.add(addr));
        });

        // Fetch names for all these addresses
        const addressNamePairs = await Promise.all(
          Array.from(allAddresses).map(async (addr) => {
            try {
              const [, name] = await get_person(contract, addr);
              return [addr, name || addr];
            } catch {
              return [addr, addr];
            }
          })
        );
        const mapping = {};
        addressNamePairs.forEach(([addr, name]) => {
          mapping[addr] = name;
        });
        setAddressToName(mapping);

      } catch (err) {
        setError('Failed to load trip details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [contract, tripId, showAddExpense]);

  const handleAddParticipant = async (e) => {
    e.preventDefault();
    setAddParticipantError('');
    if (!newParticipantName.trim() || !newParticipantAddress.trim()) {
      setAddParticipantError('Both name and address are required.');
      return;
    }
    if (!isAddress(newParticipantAddress.trim())) {
      setAddParticipantError('Invalid Ethereum address.');
      return;
    }
    setAddingParticipant(true);
    try {
      await add_person(contract, tripId, newParticipantAddress.trim(), newParticipantName.trim());
      setShowAddParticipant(false);
      setNewParticipantName('');
      setNewParticipantAddress('');
      // Refresh trip details to show new participant
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setAddParticipantError('Failed to add participant: ' + (err?.message || err));
    } finally {
      setAddingParticipant(false);
    }
  };

  const handleSettleDebt = async (tripId, debtId) => {
    try {
      await settle_debt(contract, tripId, debtId);
      // Optionally refresh debts after settling
      window.location.reload();
    } catch (err) {
      alert('Failed to settle debt: ' + (err?.message || err));
    }
  };

  if (loading) {
    return (
      <div className="trip-details-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trip-details-container">
        <div className="error-message">
          <h2>{error}</h2>
          <Link to="/" className="back-link">Return to Home</Link>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="trip-details-container">
        <div className="error-message">
          <h2>Trip not found</h2>
          <Link to="/" className="back-link">Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="trip-details-container">
      <div className="trip-details-header">
        <Link to="/" className="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Trips
        </Link>
        <h1 className="trip-details-title">{trip[1]}</h1>
        <div className="trip-status-badge">
          {trip[4].length === 0 ? 'Settled' : 'Active'}
        </div>
      </div>

      {showAddExpense ? (
        <AddExpense 
          trip={trip} 
          onExpenseAdded={() => setShowAddExpense(false)}
          contract={contract}
          onCancel={() => setShowAddExpense(false)} 
        />
      ) : (
        <div className="trip-details-content">
          <div className="trip-info-section">
            <h2>Trip Information</h2>
            <div className="trip-info-grid">
              <div className="trip-info-item">
                <span className="trip-info-label">Participants</span>
                <span className="trip-info-value">{trip[2].length}</span>
              </div>
              <div className="trip-info-item">
                <span className="trip-info-label">Total Expenses</span>
                <span className="trip-info-value">
                  ${expenses.filter(expense => expense.name !== "Debt Settlement").reduce((sum, e) => sum + e.amount, 0)}
                </span>
              </div>
            </div>
          </div>

          <div className="trip-participants-section">
            <h2>Participants</h2>
            <ul>
              {trip[2].map((addr, idx) => (
                <li key={idx}>
                  {participantNames[idx] || addr}
                  <span style={{ color: '#888', fontSize: '0.9em', marginLeft: '0.5em' }}>
                    ({addr})
                  </span>
                </li>
              ))}
            </ul>
            <div className="trip-actions">
            <button
              className="btn btn-secondary"
              onClick={() => setShowAddParticipant(!showAddParticipant)}
              style={{ marginRight: '1rem' }}
            >
              {showAddParticipant ? 'Cancel' : 'Add Participant'}
            </button>
          </div>

          {showAddParticipant && (
            <form className="add-participant-form" onSubmit={handleAddParticipant} style={{ marginTop: '1rem' }}>
              <input
                type="text"
                placeholder="Name"
                value={newParticipantName}
                onChange={e => setNewParticipantName(e.target.value)}
                className="input form-input"
                style={{ marginRight: '0.5rem' }}
              />
              <input
                type="text"
                placeholder="Ethereum Address"
                value={newParticipantAddress}
                onChange={e => setNewParticipantAddress(e.target.value)}
                className="input form-input"
                style={{ marginRight: '0.5rem' }}
              />
              <button type="submit" className="btn btn-primary" disabled={addingParticipant}>
                {addingParticipant ? 'Adding...' : 'Add'}
              </button>
              {addParticipantError && (
                <div className="error-message" style={{ marginTop: '0.5rem' }}>{addParticipantError}</div>
              )}
            </form>
          )}
          </div>

          <div className="trip-expenses-section">
            <h2>Expenses</h2>
            {expenses.length > 0 ? (
              <div className="expenses-list">
                {expenses.filter(expense => expense.name !== "Debt Settlement").map((expense, index) => (
                  <div key={index} className="expense-card">
                    <div className="expense-header">
                      <h3 className="expense-description">{expense.name}</h3>
                      <div className="expense-actions">
                        <span className="expense-amount">${expense.amount}</span>
                      </div>
                    </div>
                    <div className="expense-details">
                      <div className="expense-paid-by">
                        Paid by: <span>{addressToName[expense.expender] || expense.expender}</span>
                      </div>
                      <div className="expense-involved">
                        Involved: {expense.people_involved.map(addr => addressToName[addr] || addr).join(', ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-expenses-message">
                No expenses added yet.
              </div>
            )}
              <button 
                className="btn btn-primary"
                onClick={() => setShowAddExpense(true)}
              >
                Add Expense
              </button>
          </div>
          <div className="trip-debts-section">
            <h2>Debts</h2>
            {debts.length > 0 ? (
              <ul>
                {debts.map((debt, idx) => (
                  <li key={debt.id}>
                    <strong>{addressToName[debt.debtor] || debt.debtor}</strong> owes <strong>{addressToName[debt.creditor] || debt.creditor}</strong> ${debt.amount}
                    {debt.creditor.toLowerCase() === account?.toLowerCase() && (
                      <button
                        className="btn btn-sm btn-primary"
                        style={{ marginLeft: '1em' }}
                        onClick={() => handleSettleDebt(trip[0]?.toString?.() || trip.trip_id?.toString?.(), debt.id)}
                      >
                        Settle Up
                      </button>
                    )}                
                  </li>
                ))}
              </ul>
            ) : (
              <div className="no-debts-message">No debts! All settled.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TripDetails;
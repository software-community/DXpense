import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AddExpense from '../components/AddExpense';
import '../styles/TripDetails.css';
import { get_trip } from '../components/ContractActions';

const TripDetails = ({contract}) => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [newParticipantName, setNewParticipantName] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [participantTransactions, setParticipantTransactions] = useState({});
  const [editingExpense, setEditingExpense] = useState(null);
  const [showUpdateExpensesPrompt, setShowUpdateExpensesPrompt] = useState(false);
  const [pendingParticipant, setPendingParticipant] = useState(null);
  const [showRemoveParticipantPrompt, setShowRemoveParticipantPrompt] = useState(false);
  const [participantToRemove, setParticipantToRemove] = useState(null);

  useEffect(() => {
    // In a real application, this would fetch trip data from an API
    // For now, we'll simulate fetching data from localStorage
    const fetchTripDetails = async () => {
      try {
        setLoading(true);
        // Get trips from localStorage
        const trip = await get_trip(contract, tripId);
        console.log('Fetched trip:', trip);        
        if (trip) {
          setTrip(trip);
          
          // Get expenses for this trip from localStorage
          const tripExpenses = trip.expenses;
          setExpenses(tripExpenses);
          console.log('Fetched expenses:', tripExpenses);
          
          // Calculate total expenses and participant balances
          // calculateBalances(trip, tripExpenses);
          
          // Calculate participant transactions
          // calculateParticipantTransactions(trip, tripExpenses);
        } else {
          setError('Trip not found');
        }
      } catch (err) {
        setError('Failed to load trip details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [tripId]);

  // const calculateBalances = (tripData, tripExpenses) => {
  //   if (!tripData || !tripExpenses) return;
    
  //   // Initialize balances for all participants
  //   const balances = {};
  //   tripData.participants.forEach(participant => {
  //     balances[participant] = 0;
  //   });
    
  //   // Calculate balances based on expenses
  //   tripExpenses.forEach(expense => {
  //     const amount = expense.amount;
  //     const paidBy = expense.paidBy;
      
  //     // Add the full amount to the payer's balance
  //     balances[paidBy] += amount;
      
  //     // Subtract each participant's share
  //     if (expense.splitType === 'equal') {
  //       const sharePerPerson = amount / tripData.participants.length;
  //       tripData.participants.forEach(participant => {
  //         balances[participant] -= sharePerPerson;
  //       });
  //     } else if (expense.splitType === 'percentage') {
  //       // For percentage split, calculate based on percentages
  //       Object.entries(expense.participants).forEach(([participant, percentage]) => {
  //         const share = (amount * percentage) / 100;
  //         balances[participant] -= share;
  //       });
  //     } else if (expense.splitType === 'custom') {
  //       // For custom split, use the exact amounts
  //       Object.entries(expense.participants).forEach(([participant, amount]) => {
  //         balances[participant] -= amount;
  //       });
  //     }
  //   });
    
  //   // Update the trip with calculated balances
  //   const updatedTrip = {
  //     ...tripData,
  //     participantBalances: balances,
  //     totalExpenses: tripExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  //   };
    
  //   setTrip(updatedTrip);
    
  //   // Update the trip in localStorage
  //   const trips = JSON.parse(localStorage.getItem('trips') || '[]');
  //   const updatedTrips = trips.map(t => 
  //     t.id === tripId ? updatedTrip : t
  //   );
  //   localStorage.setItem('trips', JSON.stringify(updatedTrips));
  // };

  // const calculateParticipantTransactions = (tripData, tripExpenses) => {
  //   if (!tripData || !tripExpenses) return;
    
  //   // Initialize transactions for all participants
  //   const transactions = {};
  //   tripData.participants.forEach(participant => {
  //     transactions[participant] = {
  //       paid: [],
  //       owes: [],
  //       totalPaid: 0,
  //       totalOwes: 0
  //     };
  //   });
    
  //   // Calculate transactions based on expenses
  //   tripExpenses.forEach(expense => {
  //     const amount = expense.amount;
  //     const paidBy = expense.paidBy;
      
  //     // Add to paid transactions
  //     transactions[paidBy].paid.push({
  //       id: expense.id,
  //       description: expense.description,
  //       amount: amount,
  //       date: expense.date
  //     });
  //     transactions[paidBy].totalPaid += amount;
      
  //     // Calculate shares for each participant
  //     if (expense.splitType === 'equal') {
  //       const sharePerPerson = amount / tripData.participants.length;
  //       tripData.participants.forEach(participant => {
  //         if (participant !== paidBy) {
  //           transactions[participant].owes.push({
  //             id: expense.id,
  //             description: expense.description,
  //             amount: sharePerPerson,
  //             to: paidBy,
  //             date: expense.date
  //           });
  //           transactions[participant].totalOwes += sharePerPerson;
  //         }
  //       });
  //     } else if (expense.splitType === 'percentage') {
  //       // For percentage split, calculate based on percentages
  //       Object.entries(expense.participants).forEach(([participant, percentage]) => {
  //         if (participant !== paidBy) {
  //           const share = (amount * percentage) / 100;
  //           transactions[participant].owes.push({
  //             id: expense.id,
  //             description: expense.description,
  //             amount: share,
  //             to: paidBy,
  //             date: expense.date
  //           });
  //           transactions[participant].totalOwes += share;
  //         }
  //       });
  //     } else if (expense.splitType === 'custom') {
  //       // For custom split, use the exact amounts
  //       Object.entries(expense.participants).forEach(([participant, amount]) => {
  //         if (participant !== paidBy) {
  //           transactions[participant].owes.push({
  //             id: expense.id,
  //             description: expense.description,
  //             amount: amount,
  //             to: paidBy,
  //             date: expense.date
  //           });
  //           transactions[participant].totalOwes += amount;
  //         }
  //       });
  //     }
  //   });
    
  //   setParticipantTransactions(transactions);
  // };

  const handleAddExpense = (expense) => {
    // Add tripId to the expense
    const newExpense = {
      ...expense,
      tripId
    };
    
    // Add to expenses state
    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    
    // Save to localStorage
    const allExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    allExpenses.push(newExpense);
    localStorage.setItem('expenses', JSON.stringify(allExpenses));
    
    // Recalculate balances
    // calculateBalances(trip, updatedExpenses);
    
    // // Recalculate participant transactions
    // calculateParticipantTransactions(trip, updatedExpenses);
    
    // Hide the add expense form
    setShowAddExpense(false);
    setEditingExpense(null);
  };

  const handleUpdateExpense = (updatedExpense) => {
    // Update the expense in the expenses state
    const updatedExpenses = expenses.map(expense => 
      expense.id === updatedExpense.id ? updatedExpense : expense
    );
    setExpenses(updatedExpenses);
    
    // Update in localStorage
    const allExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    const updatedAllExpenses = allExpenses.map(expense => 
      expense.id === updatedExpense.id ? updatedExpense : expense
    );
    localStorage.setItem('expenses', JSON.stringify(updatedAllExpenses));
    
    // Recalculate balances
    calculateBalances(trip, updatedExpenses);
    
    // Recalculate participant transactions
    // calculateParticipantTransactions(trip, updatedExpenses);
    
    // Hide the add expense form
    setShowAddExpense(false);
    setEditingExpense(null);
  };

  const handleDeleteExpense = (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      // Remove the expense from the expenses state
      const updatedExpenses = expenses.filter(expense => expense.id !== expenseId);
      setExpenses(updatedExpenses);
      
      // Remove from localStorage
      const allExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
      const updatedAllExpenses = allExpenses.filter(expense => expense.id !== expenseId);
      localStorage.setItem('expenses', JSON.stringify(updatedAllExpenses));
      
      // Recalculate balances
      // calculateBalances(trip, updatedExpenses);
      
      // // Recalculate participant transactions
      // calculateParticipantTransactions(trip, updatedExpenses);
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowAddExpense(true);
  };

  const handleSettleUp = () => {
    // Update trip status to settled
    const updatedTrip = {
      ...trip,
      status: 'settled'
    };
    
    setTrip(updatedTrip);
    
    // Update in localStorage
    const trips = JSON.parse(localStorage.getItem('trips') || '[]');
    const updatedTrips = trips.map(t => 
      t.id === tripId ? updatedTrip : t
    );
    localStorage.setItem('trips', JSON.stringify(updatedTrips));
  };

  const handleAddParticipant = (e) => {
    e.preventDefault();
    
    if (!newParticipantName.trim()) {
      alert('Please enter a participant name');
      return;
    }
    
    // Check if participant already exists
    if (trip.participants.includes(newParticipantName.trim())) {
      alert('This participant already exists in the trip');
      return;
    }
    
    // If there are existing expenses, ask if user wants to update them
    if (expenses.length > 0) {
      setPendingParticipant(newParticipantName.trim());
      setShowUpdateExpensesPrompt(true);
    } else {
      // No existing expenses, just add the participant
      addParticipantToTrip(newParticipantName.trim(), false);
    }
  };

  const addParticipantToTrip = (participantName, updateExistingExpenses) => {
    // Add the new participant to the trip
    const updatedTrip = {
      ...trip,
      participants: [...trip.participants, participantName]
    };
    
    // Update the trip in state
    setTrip(updatedTrip);
    
    // Update the trip in localStorage
    const trips = JSON.parse(localStorage.getItem('trips') || '[]');
    const updatedTrips = trips.map(t => 
      t.id === tripId ? updatedTrip : t
    );
    localStorage.setItem('trips', JSON.stringify(updatedTrips));
    
    // If updating existing expenses, modify them to include the new participant
    let updatedExpenses = [...expenses];
    
    if (updateExistingExpenses) {
      updatedExpenses = expenses.map(expense => {
        // Create a new expense object with the updated participants
        const updatedExpense = { ...expense };
        
        // For equal split, recalculate the shares
        if (expense.splitType === 'equal') {
          // No need to change the expense object, the calculation will handle it
        } 
        // For percentage split, add the new participant with 0%
        else if (expense.splitType === 'percentage') {
          updatedExpense.participants = {
            ...expense.participants,
            [participantName]: 0
          };
        } 
        // For custom split, add the new participant with 0
        else if (expense.splitType === 'custom') {
          updatedExpense.participants = {
            ...expense.participants,
            [participantName]: 0
          };
        }
        
        return updatedExpense;
      });
      
      // Update expenses in localStorage
      const allExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
      const updatedAllExpenses = allExpenses.map(expense => {
        if (expense.tripId === tripId) {
          const matchingExpense = updatedExpenses.find(e => e.id === expense.id);
          return matchingExpense || expense;
        }
        return expense;
      });
      localStorage.setItem('expenses', JSON.stringify(updatedAllExpenses));
      
      // Update expenses state
      setExpenses(updatedExpenses);
    }
    
    // Recalculate balances with the new participant
    calculateBalances(updatedTrip, updatedExpenses);
    
    // Recalculate participant transactions with the new participant
    calculateParticipantTransactions(updatedTrip, updatedExpenses);
    
    // Reset the form
    setNewParticipantName('');
    setShowAddParticipant(false);
    setShowUpdateExpensesPrompt(false);
    setPendingParticipant(null);
  };

  const handleUpdateExpensesChoice = (updateExpenses) => {
    addParticipantToTrip(pendingParticipant, updateExpenses);
  };

  const handleRemoveParticipant = (participant) => {
    // Check if the participant has any expenses
    const hasExpenses = expenses.some(expense => 
      expense.paidBy === participant || 
      (expense.participants && expense.participants[participant] !== undefined)
    );
    
    if (hasExpenses) {
      // If the participant has expenses, show a confirmation prompt
      setParticipantToRemove(participant);
      setShowRemoveParticipantPrompt(true);
    } else {
      // If the participant has no expenses, remove them directly
      removeParticipantFromTrip(participant);
    }
  };

  const removeParticipantFromTrip = (participantName) => {
    // Remove the participant from the trip
    const updatedTrip = {
      ...trip,
      participants: trip.participants.filter(p => p !== participantName)
    };
    
    // Update the trip in state
    setTrip(updatedTrip);
    
    // Update the trip in localStorage
    const trips = JSON.parse(localStorage.getItem('trips') || '[]');
    const updatedTrips = trips.map(t => 
      t.id === tripId ? updatedTrip : t
    );
    localStorage.setItem('trips', JSON.stringify(updatedTrips));
    
    // Remove the participant from expenses
    let updatedExpenses = [...expenses];
    
    // Filter out expenses where the participant is the payer
    updatedExpenses = updatedExpenses.filter(expense => expense.paidBy !== participantName);
    
    // For remaining expenses, remove the participant from the participants object
    updatedExpenses = updatedExpenses.map(expense => {
      if (expense.participants && expense.participants[participantName] !== undefined) {
        const updatedExpense = { ...expense };
        const updatedParticipants = { ...expense.participants };
        delete updatedParticipants[participantName];
        updatedExpense.participants = updatedParticipants;
        return updatedExpense;
      }
      return expense;
    });
    
    // Update expenses in localStorage
    const allExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    const updatedAllExpenses = allExpenses.map(expense => {
      if (expense.tripId === tripId) {
        const matchingExpense = updatedExpenses.find(e => e.id === expense.id);
        return matchingExpense || expense;
      }
      return expense;
    });
    localStorage.setItem('expenses', JSON.stringify(updatedAllExpenses));
    
    // Update expenses state
    setExpenses(updatedExpenses);
    
    // Recalculate balances with the updated participant list
    calculateBalances(updatedTrip, updatedExpenses);
    
    // Recalculate participant transactions with the updated participant list
    calculateParticipantTransactions(updatedTrip, updatedExpenses);
    
    // Reset the prompt
    setShowRemoveParticipantPrompt(false);
    setParticipantToRemove(null);
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
        <h1 className="trip-details-title">{trip.name}</h1>
        <div className="trip-status-badge">
          {trip.status === 'settled' ? 'Settled' : 'Active'}
        </div>
      </div>

      {showAddExpense ? (
        <AddExpense 
          trip={trip} 
          expense={editingExpense}
          onExpenseAdded={handleAddExpense} 
          onExpenseUpdated={handleUpdateExpense}
          contract={contract}
          onCancel={() => {
            setShowAddExpense(false);
            setEditingExpense(null); 
          }} 
        />
      ) : (
        <div className="trip-details-content">
          <div className="trip-info-section">
            <h2>Trip Information</h2>
            <div className="trip-info-grid">
              <div className="trip-info-item">
                <span className="trip-info-label">Participants</span>
                <span className="trip-info-value">{trip.people.length}</span>
              </div>
              <div className="trip-info-item">
                <span className="trip-info-label">Total Expenses</span>
                <span className="trip-info-value">${trip.totalExpenses || 0}</span>
              </div>
            </div>
          </div>

          {trip.description && (
            <div className="trip-description-section">
              <h2>Description</h2>
              <p>{trip.description}</p>
            </div>
          )}

          <div className="trip-participants-section">
            <div className="section-header">
              <h2>Participants</h2>
              {trip.status !== 'settled' && (
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowAddParticipant(true)}
                >
                  Add Participant
                </button>
              )}
            </div>
            
            {showAddParticipant && (
              <div className="add-participant-form">
                <form onSubmit={handleAddParticipant}>
                  <div className="form-group">
                    <label htmlFor="participantName">Participant Name</label>
                    <input
                      type="text"
                      id="participantName"
                      value={newParticipantName}
                      onChange={(e) => setNewParticipantName(e.target.value)}
                      placeholder="Enter participant name"
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setShowAddParticipant(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                    >
                      Add Participant
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {showUpdateExpensesPrompt && (
              <div className="update-expenses-prompt">
                <h3>Update Existing Expenses?</h3>
                <p>Would you like to include the new participant in existing expense splits?</p>
                <div className="prompt-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => handleUpdateExpensesChoice(false)}
                  >
                    No, Keep Existing Splits
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleUpdateExpensesChoice(true)}
                  >
                    Yes, Update All Expenses
                  </button>
                </div>
              </div>
            )}
            
            {showRemoveParticipantPrompt && (
              <div className="remove-participant-prompt">
                <h3>Remove Participant?</h3>
                <p>Are you sure you want to remove <strong>{participantToRemove}</strong> from this trip?</p>
                <p className="warning-text">This will also remove all expenses paid by this participant and remove them from all expense splits.</p>
                <div className="prompt-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowRemoveParticipantPrompt(false);
                      setParticipantToRemove(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => removeParticipantFromTrip(participantToRemove)}
                  >
                    Remove Participant
                  </button>
                </div>
              </div>
            )}
            
            <div className="participants-table-container">
              <table className="participants-table">
                <thead>
                  <tr>
                    <th>Participant</th>
                    {/* <th>Total Paid</th>
                    <th>Total Owes</th>
                    <th>Balance</th>
                    <th>Transactions</th> */}
                    {/* {trip.status !== 'settled' && <th>Actions</th>} */}
                  </tr>
                </thead>
                <tbody>
                  {trip.people.map((participant, index) => (
                    <tr key={index} className="participant-row">
                      <td className="participant-name-cell">
                        <div className="participant-avatar">
                          {participant.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{participant.name}</span>
                      </td>
                      {/* <td className="participant-paid-cell">
                        ${participantTransactions[participant]?.totalPaid.toFixed(2) || 0}
                      </td>
                      <td className="participant-owes-cell">
                        ${participantTransactions[participant]?.totalOwes.toFixed(2) || 0}
                      </td>
                      <td className={`participant-balance-cell ${trip.participantBalances?.[participant] > 0 ? 'positive' : trip.participantBalances?.[participant] < 0 ? 'negative' : ''}`}>
                        ${trip.participantBalances?.[participant]?.toFixed(2) || 0}
                      </td>
                      <td className="participant-transactions-cell">
                        <div className="transactions-dropdown">
                          <button className="transactions-toggle">
                            View Transactions
                          </button>
                          <div className="transactions-content">
                            {participantTransactions[participant]?.paid.length > 0 && (
                              <div className="transactions-section">
                                <h4>Paid For:</h4>
                                <ul>
                                  {participantTransactions[participant].paid.map((transaction, idx) => (
                                    <li key={`paid-${idx}`}>
                                      {transaction.description} - ${transaction.amount.toFixed(2)} ({new Date(transaction.date).toLocaleDateString()})
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {participantTransactions[participant]?.owes.length > 0 && (
                              <div className="transactions-section">
                                <h4>Owes For:</h4>
                                <ul>
                                  {participantTransactions[participant].owes.map((transaction, idx) => (
                                    <li key={`owes-${idx}`}>
                                      {transaction.description} - ${transaction.amount.toFixed(2)} to {transaction.to} ({new Date(transaction.date).toLocaleDateString()})
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {participantTransactions[participant]?.paid.length === 0 && 
                             participantTransactions[participant]?.owes.length === 0 && (
                              <div className="no-transactions">
                                No transactions yet
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      {trip.status !== 'settled' && (
                        <td className="participant-actions-cell">
                          <button 
                            className="btn btn-icon btn-danger"
                            onClick={() => handleRemoveParticipant(participant)}
                            title="Remove Participant"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </td>
                      )} */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="trip-expenses-section">
            <h2>Expenses</h2>
            {expenses.length > 0 ? (
              <div className="expenses-list">
                {expenses.map((expense, index) => (
                  <div key={index} className="expense-card">
                    <div className="expense-header">
                      <h3 className="expense-description">{expense.name}</h3>
                      <div className="expense-actions">
                        <span className="expense-amount">${expense.amount.toFixed(2)}</span>
                        {trip.status !== 'settled' && (
                          <div className="expense-buttons">
                            <button 
                              className="btn btn-icon btn-edit"
                              onClick={() => handleEditExpense(expense)}
                              title="Edit Expense"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M18.5 2.49998C18.8978 2.10216 19.4374 1.87866 20 1.87866C20.5626 1.87866 21.1022 2.10216 21.5 2.49998C21.8978 2.89781 22.1213 3.43737 22.1213 3.99998C22.1213 4.56259 21.8978 5.10216 21.5 5.49998L12 15L8 16L9 12L18.5 2.49998Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                            <button 
                              className="btn btn-icon btn-delete"
                              onClick={() => handleDeleteExpense(expense.id)}
                              title="Delete Expense"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="expense-details">
                      <div className="expense-paid-by">
                        Paid by: <span>{expense.expender}</span>
                      </div>
                      {/* <div className="expense-split">
                        Split: <span>{expense.splitType}</span>
                      </div> */}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-expenses-message">
                No expenses added yet.
              </div>
            )}
          </div>

          <div className="trip-actions">
            {trip.status !== 'settled' && (
              <>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowAddExpense(true)}
                >
                  Add Expense
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={handleSettleUp}
                >
                  Settle Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TripDetails; 
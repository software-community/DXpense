import React, { useState, useEffect } from 'react';
import '../styles/AddExpense.css';
import { add_expense } from './ContractActions'; 

const AddExpense = ({ trip, expense, onExpenseAdded, onExpenseUpdated, contract, onCancel }) => {
  const [expenseData, setExpenseData] = useState({
    description: '',
    amount: '',
    paidBy: trip?.people[0]?.person_id || '',
    date: new Date().toISOString().split('T')[0],
    category: 'general',
    splitType: 'equal', // equal, percentage, or custom
    participants: {}
  });

  // Initialize form data based on whether we're editing an existing expense or creating a new one
  useEffect(() => {
    if (expense) {
      // If editing an existing expense, populate the form with its data
      setExpenseData({
        id: expense.id,
        description: expense.description,
        amount: expense.amount.toString(),
        paidBy: expense.paidBy.person_id,
        date: expense.date,
        category: expense.category,
        splitType: expense.splitType,
        participants: expense.participants
      });
    } else if (trip?.participants) {
      // If creating a new expense, initialize with default values
      const equalShare = 100 / trip.participants.length;
      const initialParticipants = {};
      
      trip.participants.forEach(participant => {
        initialParticipants[participant] = equalShare;
      });
      
      setExpenseData(prev => ({
        ...prev,
        paidBy: trip.participants[0].person_id || '',
        participants: initialParticipants
      }));
    }
  }, [trip, expense]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpenseData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleParticipantShareChange = (participant, value) => {
    setExpenseData(prev => ({
      ...prev,
      participants: {
        ...prev.participants,
        [participant]: parseFloat(value) || 0
      }
    }));
  };

  const handleSplitTypeChange = (e) => {
    const { value } = e.target;
    setExpenseData(prev => ({
      ...prev,
      splitType: value
    }));

    // Reset shares based on split type
    if (value === 'equal') {
      const equalShare = 100 / trip.participants.length;
      const equalParticipants = {};
      
      trip.participants.forEach(participant => {
        equalParticipants[participant] = equalShare;
      });
      
      setExpenseData(prev => ({
        ...prev,
        participants: equalParticipants
      }));
    } else if (value === 'percentage') {
      // Keep current percentages but ensure they sum to 100%
      const currentParticipants = { ...expenseData.participants };
      const total = Object.values(currentParticipants).reduce((sum, val) => sum + val, 0);
      
      if (total !== 100) {
        const adjustmentFactor = 100 / total;
        const adjustedParticipants = {};
        
        Object.keys(currentParticipants).forEach(participant => {
          adjustedParticipants[participant] = currentParticipants[participant] * adjustmentFactor;
        });
        
        setExpenseData(prev => ({
          ...prev,
          participants: adjustedParticipants
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate the form
    if (!expenseData.description || !expenseData.amount || !expenseData.paidBy) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // Prepare data for smart contract
      const tripId = trip.trip_id.toString();
      const amount = Math.round(parseFloat(expenseData.amount)).toString();
      const name = expenseData.description.toString();
      const expenderAddress = expenseData.paidBy.toString(); // Adjust as needed
      // Collect addresses of participants involved
      const peopleInvolvedAddresses = trip.people.map(p => p.person_id.toString());

      console.log("tripId", tripId, typeof tripId);
      console.log("amount", amount, typeof amount);
      console.log("name", name, typeof name);
      console.log("expenderAddress", expenderAddress, typeof expenderAddress);
      console.log("peopleInvolvedAddresses", peopleInvolvedAddresses, peopleInvolvedAddresses.map(a => typeof a));

      // Call the contract function
      const receipt = await add_expense(
        contract,
        tripId,
        amount,
        name,
        expenderAddress,
        peopleInvolvedAddresses
      );

      alert('Expense added successfully!');
      console.log('Transaction receipt:', receipt);
      // if (onExpenseAdded) onExpenseAdded(receipt);
    } catch (error) {
      alert('Failed to add expense: ' + (error.reason || error.message));
      console.error(error);
    }

    // For percentage split, ensure total is 100%
    // if (expenseData.splitType === 'percentage') {
    //   const total = Object.values(expenseData.participants).reduce((sum, val) => sum + val, 0);
    //   if (Math.abs(total - 100) > 0.01) {
    //     alert('Percentage shares must sum to 100%');
    //     return;
    //   }
    // }

    // Create the expense object
    // const expense = {
    //   ...expenseData,
    //   amount: parseFloat(expenseData.amount),
    //   tripId: trip.id
    // };

    // If editing, call the update callback, otherwise call the add callback
    // if (expenseData.id) {
    //   onExpenseUpdated(expense);
    // } else {
    //   expense.id = Date.now().toString();
    //   expense.createdAt = new Date().toISOString();
    //   onExpenseAdded(expense);
    // }
  };

  return (
    <div className="add-expense-container">
      <h2>{expense ? 'Edit Expense' : 'Add New Expense'}</h2>
      <form onSubmit={handleSubmit} className="add-expense-form">
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={expenseData.description}
            onChange={handleInputChange}
            placeholder="What was this expense for?"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={expenseData.amount}
            onChange={handleInputChange}
            placeholder="0.00"
            min="0.01"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="paidBy">Paid By</label>
          <select
            id="paidBy"
            name="paidBy"
            value={expenseData.paidBy}
            onChange={handleInputChange}
            required
          >
            {trip?.people.map((participant, index) => (
              <option key={index} value={participant.person_id}>
                {participant.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={expenseData.date}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={expenseData.category}
            onChange={handleInputChange}
          >
            <option value="general">General</option>
            <option value="food">Food</option>
            <option value="transport">Transport</option>
            <option value="accommodation">Accommodation</option>
            <option value="activities">Activities</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* <div className="form-group">
          <label htmlFor="splitType">Split Type</label>
          <select
            id="splitType"
            name="splitType"
            value={expenseData.splitType}
            onChange={handleSplitTypeChange}
          >
            <option value="equal">Equal Split</option>
            <option value="percentage">Percentage Split</option>
            <option value="custom">Custom Split</option>
          </select>
        </div> */}

        {/* <div className="participants-split">
          <h3>Split Details</h3>
          {trip?.people.map((participant, index) => (
            <div key={index} className="participant-split-item">
              <label htmlFor={`participant-${index}`}>{participant.name}</label>
              {expenseData.splitType === 'percentage' ? (
                <div className="percentage-input">
                  <input
                    type="number"
                    id={`participant-${index}`}
                    value={expenseData.participants[participant.name] || 0}
                    onChange={(e) => handleParticipantShareChange(participant.name, e.target.value)}
                    min="0"
                    max="100"
                    step="0.01"
                  />
                  <span>%</span>
                </div>
              ) : (
                <input
                  type="number"
                  id={`participant-${index}`}
                  value={expenseData.participants[participant.name] || 0}
                  onChange={(e) => handleParticipantShareChange(participant.name, e.target.value)}
                  min="0"
                  step="0.01"
                  disabled={expenseData.splitType === 'equal'}
                />
              )}
            </div>
          ))}
        </div> */}

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {expense ? 'Update Expense' : 'Add Expense'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExpense; 
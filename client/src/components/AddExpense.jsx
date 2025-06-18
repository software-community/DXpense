import React, { useState, useEffect } from 'react';
import '../styles/AddExpense.css';
import { add_expense, get_person } from './ContractActions';

const AddExpense = ({ trip, onExpenseAdded, contract, onCancel }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [involved, setInvolved] = useState([]);

  useEffect(() => {
    const fetchParticipants = async () => {
      if (Array.isArray(trip?.[2]) && trip[2].length > 0 && contract) {
        const parts = await Promise.all(
          trip[2].map(async (addr) => {
            try {
              const [person_id, name] = await get_person(contract, addr);
              return { person_id, name: name || addr };
            } catch {
              return { person_id: addr, name: addr };
            }
          })
        );
        setParticipants(parts);
        setPaidBy(parts[0]?.person_id || '');
        setInvolved(parts.map(p => p.person_id)); // default: all checked
      }
    };
    fetchParticipants();
  }, [trip, contract]);

  const handleInvolvedChange = (person_id) => {
    setInvolved(prev =>
      prev.includes(person_id)
        ? prev.filter(id => id !== person_id)
        : [...prev, person_id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !amount || !paidBy || involved.length === 0) {
      alert('Please fill in all required fields and select at least one participant involved.');
      return;
    }
    setLoading(true);
    try {
      const tripId = trip.trip_id?.toString?.() || trip[0]?.toString?.();
      const amt = Math.round(parseFloat(amount)).toString();
      const name = description.toString();
      const expenderAddress = paidBy.toString();
      const peopleInvolvedAddresses = involved.map(id => id.toString());

      const receipt = await add_expense(
        contract,
        tripId,
        amt,
        name,
        expenderAddress,
        peopleInvolvedAddresses
      );

      alert('Expense added successfully!');
      if (onExpenseAdded) onExpenseAdded(receipt);
    } catch (error) {
      alert('Failed to add expense: ' + (error.reason || error.message));
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="add-expense-container">
      <h2>Add New Expense</h2>
      <form onSubmit={handleSubmit} className="add-expense-form">
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="What was this expense for?"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
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
            value={paidBy}
            onChange={e => setPaidBy(e.target.value)}
            required
          >
            {participants.map((participant, index) => (
              <option key={index} value={participant.person_id}>
                {participant.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>People Involved</label>
          <div>
            {participants.map((participant, idx) => (
              <label key={participant.person_id} style={{ marginRight: '1em' }}>
                <input
                  type="checkbox"
                  checked={involved.includes(participant.person_id)}
                  onChange={() => handleInvolvedChange(participant.person_id)}
                />
                {participant.name}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="general">General</option>
            <option value="food">Food</option>
            <option value="transport">Transport</option>
            <option value="accommodation">Accommodation</option>
            <option value="activities">Activities</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            Add Expense
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExpense;
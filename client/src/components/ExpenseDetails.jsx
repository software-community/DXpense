import React, { useState } from "react";
import '../styles/design-system.css';

const ExpenseDetails = () => {
  const [expenseName, setExpenseName] = useState('');
  const [amount, setAmount] = useState('');
  const [people, setPeople] = useState([
    { id: 1, name: "Person1", checked: false },
    { id: 2, name: "Person2", checked: false },
    { id: 3, name: "Person3", checked: false },
    { id: 4, name: "Person4", checked: false },
    { id: 5, name: "Person5", checked: false },
  ]);

  const handleCheckboxChange = (id) => {
    setPeople(
      people.map((person) =>
        person.id === id ? { ...person, checked: !person.checked } : person
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedPeople = people.filter(person => person.checked);
    console.log('Expense details:', {
      name: expenseName,
      amount: parseFloat(amount),
      people: selectedPeople
    });
    // Reset form
    setExpenseName('');
    setAmount('');
    setPeople(people.map(person => ({ ...person, checked: false })));
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Add Expense</h2>
      
      <div style={{ marginBottom: 'var(--spacing-md)' }}>
        <label htmlFor="expenseName" style={{ display: 'block', marginBottom: 'var(--spacing-xs)' }}>
          Expense Name
        </label>
        <input
          id="expenseName"
          type="text"
          value={expenseName}
          onChange={(e) => setExpenseName(e.target.value)}
          className="input"
          placeholder="Enter name of expense..."
          required
        />
      </div>

      <div style={{ marginBottom: 'var(--spacing-md)' }}>
        <label htmlFor="amount" style={{ display: 'block', marginBottom: 'var(--spacing-xs)' }}>
          Amount
        </label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input"
          placeholder="Enter amount..."
          min="0"
          step="0.01"
          required
        />
      </div>

      <div>
        <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>Select People</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: 'var(--spacing-sm)'
        }}>
          {people.map((person) => (
            <label 
              key={person.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                padding: 'var(--spacing-sm)',
                background: person.checked ? 'var(--background-light)' : 'transparent',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              <input
                type="checkbox"
                checked={person.checked}
                onChange={() => handleCheckboxChange(person.id)}
                style={{ cursor: 'pointer' }}
              />
              <span>{person.name}</span>
            </label>
          ))}
        </div>
      </div>

      <button type="submit" className="btn btn-primary" style={{ marginTop: 'var(--spacing-lg)' }}>
        Add Expense
      </button>
    </form>
  );
};

export default ExpenseDetails;

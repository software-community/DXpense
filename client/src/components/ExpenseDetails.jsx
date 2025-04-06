import React from "react";
import { useState } from "react";
const ExpenseDetails = () => {
  const initialPeople = [
    { id: 1, name: "Person1", checked: false },
    { id: 2, name: "Person2", checked: false },
    { id: 3, name: "Person3", checked: false },
    { id: 4, name: "Person4", checked: false },
    { id: 5, name: "Person5", checked: false },
  ];

  const [people, setPeople] = useState(initialPeople);

  const handleCheckboxChange = (id) => {
    setPeople(
      people.map((person) =>
        person.id === id ? { ...person, checked: !person.checked } : person
      )
    );
  };
  return (
    <form className="expense-form">
      <h1>Add Expense</h1>
      <input
        type="text"
        placeholder="Enter name of Expense..."
        className="expense-name-input"
      />
      <input
        type="number"
        placeholder="Enter expenditure..."
        className="expenditure-input"
      />
      <div className="choose-people">
        <h3>Choose People</h3>
        {people.map((person) => (
          <div key={person.id}>
            <input
              type="checkbox"
              id={`person-${person.id}`}
              checked={person.checked}
              onChange={() => handleCheckboxChange(person.id)}
              className="checkBox"
            />
            <label htmlFor={`${person.name}`} className="checkBox-items">
              {person.name}
            </label>
          </div>
        ))}
      </div>
      <button type="submit" className="add-button">
        Submit
      </button>
    </form>
  );
};

export default ExpenseDetails;

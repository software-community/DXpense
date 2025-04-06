import { useState } from 'react'
import './App.css'
import { Routes, Route } from "react-router-dom";
import NavBar from './components/NavBar'
import Home from './Pages/Home'
import AddExpense from './Pages/AddExpense';

function App() {
  return (
    <>
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/addExpense" element={<AddExpense />} />
        </Routes>
      </main>
    </>
  )
}

export default App

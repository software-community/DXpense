import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract, parseEther, formatEther } from "ethers";
import Lock from "./Lock.json";

let contract;
let provider;
let signer;

function App() {
  const [names, setNames] = useState([])
  const [c, setC] = useState()

  useEffect(() => {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this app.");
      return;
    }
  }, []);

  useEffect(() => {

    const initialize_contract = async () => {
      console.log(process.env.REACT_APP_CONTRACT_ADDRESS)
      provider = new BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
      contract = new Contract(
        process.env.REACT_APP_CONTRACT_ADDRESS,
        Lock,
        signer
      );
      console.log(contract)
      setC(contract)
    }

    initialize_contract();

  }, []);

  useEffect(() => {
    if (!contract) return;
    console.log("fetching names")
    const fetchNames = async () => {
      const res = await contract.getNames();
      setNames(res)
      console.log("Names:", names);
    }
    fetchNames();
  }, [c]);

  const handleAddName = async () => {
    const name = document.querySelector("input[name=name]").value;
    const addNameTx = await contract.addName(name);
    await addNameTx.wait();
    console.log("Name added successfully!");
  }

  return (
    <div className="app">
      {(
        <div className="contract-info">
          <div>
            <input name="name"></input>
            <button onClick={handleAddName}>add name</button>
            <p>{names}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
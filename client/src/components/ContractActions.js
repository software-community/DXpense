import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract, parseEther, formatEther } from "ethers";
import Lock from "../Lock.json";

let contract;
let provider;
let signer;

export const initialize_contract = async () => {
    console.log(process.env.REACT_APP_CONTRACT_ADDRESS);
    provider = new BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    contract = new Contract(
        process.env.REACT_APP_CONTRACT_ADDRESS,
        Lock, // Use only the abi property
        signer
    );
    console.log(contract);
    return contract;
};

export const get_trips = async (contract) => {
    try {
        const res = await contract.getAllTrips();
        return res;
    } catch (error) {
        console.error("Error fetching trips:", error);
        throw error;
    }
};

export const get_trip = async (contract, tripId) => {
    try {
        const res = await contract.getTrip(tripId);
        return res;
    } catch (error) {
        console.error("Error fetching trip:", error);
        throw error;
    }
};

export const add_trip = async (contract, tripName, ownerName) => {
    try {
        const tx = await contract.AddTrip(tripName, ownerName);
        const receipt = await tx.wait();
        if (receipt.status === 1) {
            return receipt;
        } else {
            throw new Error("Transaction reverted");
        }
    } catch (error) {
        console.error("Error adding trip:", error);
        throw error;
    }
};

export const add_person = async (contract, tripId, personAddress, personName) => {
    try {
        const tx = await contract.AddPerson(tripId, personAddress, personName);
        const receipt = await tx.wait();
        if (receipt.status === 1) {
            return receipt;
        } else {
            throw new Error("Transaction reverted");
        }
    } catch (error) {
        console.error("Error adding person:", error);
        throw error;
    }
};

export const add_expense = async (contract, tripId, amount, name, expenderAddress, peopleInvolvedAddresses) => {
    try {
        const tx = await contract.AddExpense(
            tripId,
            amount,
            name,
            expenderAddress,
            peopleInvolvedAddresses
        );
        const receipt = await tx.wait();
        if (receipt.status === 1) {
            return receipt;
        } else {
            throw new Error("Transaction reverted");
        }
    } catch (error) {
        console.error("Error adding expense:", error);
        throw error;
    }
};

export const settle_debt = async (contract, tripId, debtId, value) => {
    try {
        // value should be in wei (use parseEther if needed)
        const tx = await contract.settleDebt(tripId, debtId, { value });
        const receipt = await tx.wait();
        if (receipt.status === 1) {
            return receipt;
        } else {
            throw new Error("Transaction reverted");
        }
    } catch (error) {
        console.error("Error settling debt:", error);
        throw error;
    }
};

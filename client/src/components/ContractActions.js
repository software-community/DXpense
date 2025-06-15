import { BrowserProvider, Contract } from "ethers";
import Lock from "../Lock.json"; // Your ABI

let contract;
let provider;
let signer;

export const initialize_contract = async () => {
    provider = new BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    contract = new Contract(
        process.env.REACT_APP_CONTRACT_ADDRESS,
        Lock,
        signer
    );
    return contract;
};

// Get all trip IDs for the current user
export const get_user_trip_ids = async (contract) => {
    try {
        if (!contract) {
            throw new Error("Contract not initialized");
        }
        const tripIds = await contract.getUserTripIds();
        return tripIds;
    } catch (error) {
        console.error("Error fetching user trip IDs:", error);
        throw error;
    }
};

// Get a single trip by ID
export const get_trip = async (contract, tripId) => {
    try {
        return await contract.getTrip(tripId);
    } catch (error) {
        console.error("Error fetching trip:", error);
        throw error;
    }
};

// Get a debt by ID
export const get_debt = async (contract, debtId) => {
    try {
        let a = contract.getDebt(debtId);
        console.log("Debt fetched:", a);
        return a;
    } catch (error) {
        console.error("Error fetching debt:", error);
        throw error;
    }
};

// Add a new trip
export const add_trip = async (contract, tripName, ownerName) => {
    try {
        const tx = await contract.AddTrip(tripName, ownerName);
        const receipt = await tx.wait();
        if (receipt.status === 1) return receipt;
        throw new Error("Transaction reverted");
    } catch (error) {
        console.error("Error adding trip:", error);
        throw error;
    }
};

// Add a person to a trip
export const add_person = async (contract, tripId, personAddress, personName) => {
    try {
        const tx = await contract.AddPerson(tripId, personAddress, personName);
        const receipt = await tx.wait();
        if (receipt.status === 1) return receipt;
        throw new Error("Transaction reverted");
    } catch (error) {
        console.error("Error adding person:", error);
        throw error;
    }
};

// Add an expense to a trip
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
        if (receipt.status === 1) return receipt;
        throw new Error("Transaction reverted");
    } catch (error) {
        console.error("Error adding expense:", error);
        throw error;
    }
};

// Get an expense by ID
export const get_expense = async (contract, expenseId) => {
    try {
        return await contract.getExpense(expenseId);
    } catch (error) {
        console.error("Error fetching expense:", error);
        throw error;
    }
};

// Get a person by address
export const get_person = async (contract, address) => {
    try {
        return await contract.getPerson(address);
    } catch (error) {
        console.error("Error fetching person:", error);
        throw error;
    }
};

// Calculate debts for a trip
export const calculate_debts = async (contract, tripId) => {
    try {
        const tx = await contract.calculateDebts(tripId);
        const receipt = await tx.wait();
        if (receipt.status === 1) return receipt;
        throw new Error("Transaction reverted");
    } catch (error) {
        console.error("Error calculating debts:", error);
        throw error;
    }
};

// Settle a debt
export const settle_debt = async (contract, tripId, debtId) => {
    try {
        const tx = await contract.settleDebt(tripId, debtId);
        const receipt = await tx.wait();
        if (receipt.status === 1) return receipt;
        throw new Error("Transaction reverted");
    } catch (error) {
        console.error("Error settling debt:", error);
        throw error;
    }
};
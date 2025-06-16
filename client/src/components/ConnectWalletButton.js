import React, { useState } from "react";

function ConnectWalletButton({ account, setAccount }) {
  const [currentAccount, setCurrentAccount] = useState(null);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask to use this app.");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length === 0) {
        console.log("No accounts found");
        return;
      }

      setCurrentAccount(accounts[0]);
      setAccount(accounts[0]);
      console.log("Connected account:", accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const truncateAccount = (account) => {
    return `${account.slice(0, 6)}...${account.slice(-4)}`;
  };

  return (
    <div>
      {account ? (
        <b>
          Connected Account: {truncateAccount(account)}
        </b>
      ) : (
        <button onClick={connectWallet}>Connect Web3 Wallet</button>
      )}
    </div>
  );
}

export default ConnectWalletButton;
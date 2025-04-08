import React from "react";

function ConnectWalletButton({ setAccount }) {
  const [accounts, setAccounts] = React.useState([]);
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask to use this app.");
        return;
      }

      let acc = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccounts(acc);
      if (accounts.length === 0) {
        console.log("No accounts found");
        return;
      }
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        console.log("Connected account:", accounts[0]);
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return(
    <div>
    { 
      accounts.length === 0 ?
      <button onClick={connectWallet}>Connect Web3 Wallet</button>
      :
      <p>Connected Account: {accounts[0].slice(0, 3)}...${accounts[0].slice(-3)}</p>
    }
    </div>
  ) 
}

export default ConnectWalletButton;
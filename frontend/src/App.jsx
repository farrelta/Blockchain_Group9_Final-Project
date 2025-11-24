import { useState } from 'react';
import { ethers } from 'ethers';
import BankArtifact from './SimpleBank.json';

// !!! PASTE YOUR NEW ADDRESS HERE !!!
const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; 

function App() {
  const [balance, setBalance] = useState('0');
  const [amount, setAmount] = useState('');

  // Helper to connect to wallet
  async function getContract() {
    if (typeof window.ethereum === 'undefined') return null;
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(contractAddress, BankArtifact.abi, signer);
  }

  async function refreshBalance() {
    const contract = await getContract();
    if (!contract) return;
    try {
      const balanceBigInt = await contract.getBalance();
      setBalance(ethers.formatEther(balanceBigInt));
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeposit() {
    const contract = await getContract();
    if (!contract || !amount) return;
    try {
      const tx = await contract.deposit({ value: ethers.parseEther(amount) });
      await tx.wait(); // Wait for mining
      setAmount('');
      refreshBalance();
    } catch (error) {
      console.error(error);
    }
  }

  // --- NEW WITHDRAW FUNCTION ---
  async function handleWithdraw() {
    const contract = await getContract();
    if (!contract || !amount) return;
    try {
      // Call the new Solidity function
      const tx = await contract.withdraw(ethers.parseEther(amount));
      await tx.wait();
      setAmount('');
      refreshBalance();
    } catch (error) {
      console.error("Withdraw Error:", error);
      alert("Error: Do you have enough funds deposited?");
    }
  }

  return (
    <div style={{ padding: "50px", fontFamily: "sans-serif" }}>
      <h1>My Bank DApp</h1>
      <h3>My Balance in Contract: {balance} ETH</h3>
      <button onClick={refreshBalance}>Refresh Balance</button>
      <br /><br />

      <input 
        type="number"
        value={amount} 
        onChange={e => setAmount(e.target.value)} 
        placeholder="Amount in ETH" 
        style={{ padding: "10px", marginRight: "10px" }}
      />
      
      <button onClick={handleDeposit} style={{ padding: "10px", marginRight: "10px" }}>
        Deposit
      </button>

      <button onClick={handleWithdraw} style={{ padding: "10px", backgroundColor: "salmon" }}>
        Withdraw
      </button>
    </div>
  );
}

export default App;
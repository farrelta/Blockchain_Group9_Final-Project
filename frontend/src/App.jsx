import { useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import BankArtifact from './SimpleBank.json';

const contractAddress = import.meta.env.VITE_BANK_CONTRACT_ADDRESS;
const expectedChainId = BigInt(import.meta.env.VITE_CHAIN_ID || '11155111');

function App() {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('—');
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const getProvider = useCallback(() => {
    if (!window.ethereum) throw new Error('Install a browser wallet to use this bank.');
    if (!ethers.isAddress(contractAddress || '')) {
      throw new Error('Set VITE_BANK_CONTRACT_ADDRESS in the frontend environment.');
    }
    return new ethers.BrowserProvider(window.ethereum);
  }, []);

  const checkNetwork = useCallback(async (provider) => {
    const network = await provider.getNetwork();
    if (network.chainId !== expectedChainId) {
      throw new Error(`Switch your wallet to chain ${expectedChainId.toString()}.`);
    }
  }, []);

  const refreshBalance = useCallback(async (selectedAccount = account) => {
    if (!selectedAccount) {
      setBalance('—');
      return;
    }

    try {
      const provider = getProvider();
      await checkNetwork(provider);
      const bank = new ethers.Contract(contractAddress, BankArtifact.abi, provider);
      const value = await bank.balances(selectedAccount);
      setBalance(ethers.formatEther(value));
      setMessage('');
    } catch (error) {
      setMessage(error.message || 'Could not read your balance.');
    }
  }, [account, checkNetwork, getProvider]);

  const connectWallet = async () => {
    try {
      const provider = getProvider();
      const [selectedAccount] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      await checkNetwork(provider);
      setAccount(selectedAccount);
      await refreshBalance(selectedAccount);
    } catch (error) {
      setMessage(error.message || 'Could not connect to your wallet.');
    }
  };

  const submitTransaction = async (action) => {
    if (!amount || !account) {
      setMessage('Connect your wallet and enter an amount greater than zero.');
      return;
    }

    let value;
    try {
      value = ethers.parseEther(amount);
      if (value <= 0n) throw new Error('Enter an amount greater than zero.');
    } catch (error) {
      setMessage(error.message || 'Enter a valid ETH amount.');
      return;
    }

    setBusy(true);
    setMessage('Waiting for transaction confirmation…');
    try {
      const provider = getProvider();
      await checkNetwork(provider);
      const signer = await provider.getSigner();
      const bank = new ethers.Contract(contractAddress, BankArtifact.abi, signer);
      const tx = action === 'deposit'
        ? await bank.deposit({ value })
        : await bank.withdraw(value);
      await tx.wait();
      setAmount('');
      setMessage('Transaction confirmed.');
      await refreshBalance(account);
    } catch (error) {
      setMessage(error.shortMessage || error.reason || error.message || 'Transaction failed.');
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (!window.ethereum) return undefined;

    let active = true;
    const loadConnectedAccount = async () => {
      try {
        const [selectedAccount] = await window.ethereum.request({ method: 'eth_accounts' });
        if (active && selectedAccount) setAccount(selectedAccount);
      } catch (error) {
        if (active) setMessage(error.message || 'Could not check wallet connection.');
      }
    };
    const handleAccountsChanged = ([selectedAccount]) => {
      setAccount(selectedAccount || '');
      setBalance('—');
    };
    const handleChainChanged = () => refreshBalance();

    loadConnectedAccount();
    window.ethereum.on?.('accountsChanged', handleAccountsChanged);
    window.ethereum.on?.('chainChanged', handleChainChanged);
    return () => {
      active = false;
      window.ethereum.removeListener?.('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener?.('chainChanged', handleChainChanged);
    };
  }, [refreshBalance]);

  useEffect(() => {
    if (account) refreshBalance(account);
  }, [account, refreshBalance]);

  return (
    <main className="bank-app">
      <h1>My Bank DApp</h1>
      <p>Connected wallet: {account ? `${account.slice(0, 6)}…${account.slice(-4)}` : 'Not connected'}</p>
      <button onClick={connectWallet} disabled={busy}>
        {account ? 'Reconnect wallet' : 'Connect wallet'}
      </button>

      <h2>Contract balance: {balance} ETH</h2>
      <button onClick={() => refreshBalance()} disabled={!account || busy}>Refresh balance</button>

      <div className="bank-actions">
        <input
          type="number"
          min="0"
          step="any"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="Amount in ETH"
          aria-label="Amount in ETH"
        />
        <button onClick={() => submitTransaction('deposit')} disabled={!account || busy}>Deposit</button>
        <button onClick={() => submitTransaction('withdraw')} disabled={!account || busy}>Withdraw</button>
      </div>
      {busy && <p role="status">{message}</p>}
      {!busy && message && <p role="alert">{message}</p>}
    </main>
  );
}

export default App;

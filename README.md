# SimpleBank DApp

A decentralized banking demo built with Solidity, Hardhat, React, and ethers.js. Users can connect a browser wallet, deposit ETH into the `SimpleBank` contract, view their deposited balance, and withdraw funds.

## Features

- Per-wallet ETH balances
- Deposits and withdrawals through a browser wallet
- Configurable contract address and chain ID
- Hardhat tests for deposits, balance tracking, and withdrawals

## Tech stack

- **Smart contract:** Solidity 0.8.24, Hardhat, Hardhat Ignition
- **Frontend:** React 19, Vite, ethers.js 6
- **Wallet:** An injected browser wallet, such as MetaMask

## Project structure

```text
backend/
  contracts/SimpleBank.sol       # Bank contract
  ignition/modules/BankModule.js # Deployment module
  test/SimpleBank.js             # Contract tests
frontend/
  src/App.jsx                    # DApp interface
  src/SimpleBank.json            # Contract ABI and artifact
```

## Prerequisites

- Node.js and npm
- A browser wallet for interacting with the app
- For Sepolia deployment: a Sepolia RPC endpoint and a funded testnet account

## Installation

Install dependencies in each project folder:

```sh
cd backend
npm ci
```

```sh
cd frontend
npm ci
```

## Configuration

### Frontend

Copy `frontend/.env.example` to `frontend/.env` and set the deployed contract address and network chain ID:

```env
VITE_BANK_CONTRACT_ADDRESS=0xYourDeployedSimpleBankAddress
VITE_CHAIN_ID=11155111
```

Use chain ID `31337` when connecting to a local Hardhat node, or `11155111` for Sepolia. Restart the Vite server after changing environment values.

### Backend deployment

For Sepolia, copy `backend/.env.example` to `backend/.env` and set `SEPOLIA_RPC_URL` and `PRIVATE_KEY`. Keep the private key secret and never commit `.env` files.

## Run locally

Start a local Hardhat node in one terminal:

```sh
cd backend
npx hardhat node
```

In a second terminal, deploy the contract to that node:

```sh
cd backend
npx hardhat ignition deploy ./ignition/modules/BankModule.js --network localhost
```

Copy the deployed contract address into `frontend/.env`, set `VITE_CHAIN_ID=31337`, then start the frontend in a third terminal:

```sh
cd frontend
npm run dev
```

Connect your wallet to the local Hardhat network and import one of the local development accounts to use the DApp.

## Deploy to Sepolia

After configuring `backend/.env`, deploy the contract:

```sh
cd backend
npx hardhat ignition deploy ./ignition/modules/BankModule.js --network sepolia
```

Set the resulting contract address in `frontend/.env` and use `VITE_CHAIN_ID=11155111`. The connected wallet must be on Sepolia to read balances and send transactions.

## Scripts

Run backend commands from `backend/` and frontend commands from `frontend/`:

| Command | Description |
| --- | --- |
| `npm test` | Run the Hardhat contract tests |
| `npm run compile` | Compile the Solidity contracts |
| `npm run dev` | Start the Vite development server |
| `npm run lint` | Check frontend code with ESLint |
| `npm run build` | Create a production frontend build |
| `npm run preview` | Preview the production build locally |

## License

The `SimpleBank` contract is marked MIT-licensed. See its SPDX identifier in `backend/contracts/SimpleBank.sol`.

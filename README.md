# SimpleBank DApp

This project contains a Solidity bank contract and a React frontend that connects to it through a browser wallet.

## Setup

Install dependencies in both folders:

```sh
cd backend && npm install
cd ../frontend && npm install
```

Configure the Sepolia deployment credentials using `backend/.env.example` as a guide. Deploy the contract with:

```sh
cd backend
npx hardhat ignition deploy ./ignition/modules/BankModule.js --network sepolia
```

Set the deployed address and target chain in `frontend/.env` using `frontend/.env.example`. Then start the app from the frontend directory with `npm run dev`. The wallet must be connected to the configured chain to read balances and send transactions.

## Tests

Run the contract tests with `cd backend && npm test`.

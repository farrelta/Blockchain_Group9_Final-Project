# SimpleBank contract

Install dependencies with `npm install` in this directory. Compile and test the bank contract with:

```shell
npm test
npm run compile
```

To deploy locally, start a Hardhat node in one terminal and deploy from another:

```shell
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/BankModule.js --network localhost
```

For Sepolia, create a `.env` file with `SEPOLIA_RPC_URL` and `PRIVATE_KEY` set to your own RPC endpoint and funded deployer key. The deployment command is:

```shell
npx hardhat ignition deploy ./ignition/modules/BankModule.js --network sepolia
```

Never commit `.env` or share a funded private key.

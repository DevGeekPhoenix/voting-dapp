# Voting Decentralized Application (DApp)

## Description

This project is a decentralized application (DApp) for conducting secure and transparent voting processes using blockchain technology.

## Features

- Secure voting mechanism
- Real-time vote counting
- Real-time commenting

## Installation

To install client of this project, clone the repository and install the dependencies.

```bash
git clone https://github.com/DevGeekPhoenix/voting-dapp.git
cd voting-dapp/client
yarn install
```
Notes: 
- In production env you will work with MetaMask Provider but in development env you need to run your local network.  

- For local development run your Ganache and check your network info to be synced with truffle-config.js

## Usage
After installation, follow these steps to run the application in development env:
1. Start the blockchain network. 
2. Deploy the Vote smart contract.
3. Replace contract address and wallet address in `client\src\constants\global-constants.ts`
3. Run the front-end application.

## Production Address

The application is also deployed and accessible on the production server. You can visit the live version by clicking the link below:

[Voting Decentralized Application Production](https://phoenix-voting-dapp.vercel.app/)

## Built With
- Ethereum - Blockchain platform
- Solidity - Smart contract language
- Ganache - Local blockchain network
- Truffle - Blockchain development environment
- NextJs - Front-end framework
- Web3.js - Library for interacting with Ethereum blockchain

## Contributing
Contributions to Voting Decentralized Application are welcome and encouraged! If you find any bugs or have ideas for new features, please open an issue or submit a pull request following the standard GitHub workflow.

1. Fork the repository on GitHub.
2. Clone the forked repository to your local machine.
3. Create a new branch from the `master` branch for your feature/bugfix.
4. Make your changes, commit them, and push the changes to your fork.
5. Submit a pull request to the `master` branch of the original repository.

Please ensure that your pull request includes a detailed description of the changes you've made and any relevant testing or documentation updates.

## License
This project is licensed under [MIT License] - see the LICENSE file for more details.

## Authors
- **Phoenix** - *Front-end and Blockchain Developer* - [DevGeekPhoenix](https://www.linkedin.com/in/hoseinzarrabi/)

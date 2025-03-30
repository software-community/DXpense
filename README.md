# Dxpense Solidity Project

A decentralized expense management application built on the Ethereum blockchain using Solidity and React.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Smart Contract Details](#smart-contract-details)
- [Contributing](#contributing)
- [License](#license)

## Introduction
Dxpense is a decentralized application (dApp) that allows users to manage their expenses securely on the blockchain. It leverages Ethereum smart contracts to ensure transparency and immutability.

## Features
- Add and manage expense records.
- Fetch and display expense data from the blockchain.
- Secure transactions using MetaMask.

## Technologies Used
- **Frontend**: React, ethers.js
- **Blockchain**: Solidity, Ethereum
- **Tools**: Hardhat, MetaMask

## Setup and Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/software-community/DXpense.git
   cd Dxpense
   ```

2. Switch to the master branch
   ```bash
   git checkout master
   ```

3. Install dependencies:
    ```
    npm install
    ```

4. Deploy Smart Contract:
    ```
    npx hardhat ignition deploy ./ignition/modules/Dxpense.js --network localhost
    ```

5. Set up environment variables by creating a .env in the client directory and entering the following: 
    ```
    REACT_APP_CONTRACT_ADDRESS=<Your_Contract_Address>
    ```

6. Start the development server: 
    ```
    cd client 
    npm start
    ```

## Usage
1. Open the application in your browser.
2. Connect your MetaMask wallet.
3. Interact with the dApp. Right now you can only add and view names stored in a list stored on the blockchain.

## Smart Contract Details
- **Contract Name**: `Dxpense`
- **Functions**:
  - `addName(string name)`: Adds a new name to the contract.
  - `getNames()`: Fetches all stored names.

## Contributing
Contributions are welcome! If you have suggestions or find any issues, feel free to open an issue or submit a pull request.
### Smart Contract:
Navigate to the contracts directory and open Dxpense.sol to make changes to the smart contract. The following steps need to be followed in order for the changes to be reflected on the frontend: 
1. Compile the smart contract:
    ```
    npx hardhat compile
    ```
2. Deploy the smart contract: 
    ```
    npx hardhat ignition deploy ./ignition/modules/Dxpense.js --network localhost --reset
    ```
3. Add the deployment address to the .env file in the src folder of the client directory
4. Update the smart contract ABI file. Navigate to the artifacts/contracts/Dxpense.sol/Dxpense.json file and copy the abi array. Paste it into the Lock.json file in the src folder of the client directory.
5. Finally, restart the react server using npm start.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

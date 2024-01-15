# 🎉 Blockchain Voting System

This project is a blockchain voting system implemented in Solidity. It allows the owner of the contract to add candidates and authorize voters using signatures. The voters can then vote for their preferred candidate using their signature. The contract also allows anyone to query the candidates and the winner of the election.

## 🛠 Installation

To install the project, you need to have Node.js and npm installed. Then, clone the repository and follow the procedure in the project directory:

## 📝 Testing

To run the unit tests for the smart contract, run the following command in the project directory:

```
npx hardhat test

```
This will launch the Hardhat network and execute the tests in the ``` test ``` folder.

## 🗨 Deployment
To deploy the smart contract to a network, you need to have an account with some ether and a provider URL. You can use a service like Alchemy or Infura to get a provider URL. Then, edit the  ```hardhat.config.js ``` file and add your account private key and provider URL to the network configuration. For example, to deploy to the Rinkeby testnet, you can use the following configuration:

```
module.exports = {
  solidity: "0.8.0",
  networks: {
    rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/your-api-key",
      accounts: ["your-private-key"],
    },
  },
};
```

Then, run the following command in the project directory:
```
npx hardhat run scripts/deploy.js --network rinkeby

```

This will compile and deploy the smart contract to the Rinkeby network and output the contract address.

## 📌 Usage
To interact with the smart contract, you can use a tool like Remix or Etherscan. You need to have the contract address and the ABI, which you can find in the artifacts folder after deployment.

The smart contract has the following functions:

```addCandidate(string name)```: Allows the owner to add a new candidate with the given name. Emits a CandidateAdded event with the candidate ID and name.

```getCandidateIds()```: Returns an array of the candidate IDs.

```getCandidate(uint256 id)```: Returns the details of the candidate with the given ID, including the name and the vote count.

```vote(uint256 id, bytes signature)```: Allows a voter to vote for the candidate with the given ID, using the signature provided by the owner. Emits a Voted event with the voter address and the candidate ID.

```getWinner()```: Returns the details of the candidate with the most votes, including the name and the vote count.

## 🤝 Contributions
You are welcomed! for any contributions, or suggestions. Any useful updation of code, or modification in a file is expected as a piece of contribution.
### Steps for contributions:
1. 😉 Star this repository.
2. Clone this repository.
3. Make an appropriate PR, and describing your changes in a systematic format.

## ✍ Contact Information

If you have any questions or suggestions regarding the solutions in this repository, you can reach out to me <a href="mailto:ameyamuktewargithub@gmail.com"><b>Via Mail</b></a>. 

## 😎 Enjoy your decentralized voting system.

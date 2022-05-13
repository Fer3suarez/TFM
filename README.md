# DEVELOPMENT OF A WEB SERVICE FOR THE MANAGEMENT OF ART GALLERIES BASED ON NFTS ON THE ETHEREUM NETWORK

### What is the problem?

Identifying whether a work of art is original, or a cheap copy is something exceedingly difficult to achieve, since it cannot be distinguished.
People who are dedicated to falsifying these works usually achieve remarkably similar results.
This is a big problem for collectors who are dedicated to buying works of art or even for the artists themselves, since they throw overboard a work that involves a lot of time and effort.



### What is proposed?

As a result of this problem arose the well-known so-called Non-Fungible Tokens, or better known, as NFTs, unique and inimitable digital files that can be traded as if they were physical works of art.
However, these digital files cannot be counterfeited in any way, as no two NFTs are the same. 
It is true that there may be replicas, some more similar than others, but none will be exactly the same, since these files are certified and protected in such a way that at all times any movement that occurs in the file is recorded, thanks to Blockchain technology, an immutable, secure and decentralized ledger that records blocks of transactions verified by the nodes of the network. 
This technology is the participant that the movements are registered in the network, through blocks, each of them containing the identifier of the previous block, to ensure the veracity and authenticity of the chain. 

The objective of this project is to deepen in Blockchain technology and for this purpose a case study will be developed in which an art gallery will be managed using NFTs to certify who owns each of the works.

A web service will be developed that will use a Blockchain network, from the Hardhat development environment, which allows compiling, debugging and executing smart contracts and non-fungible tokens to certify the ownership of each of the works, in such a way that each user who registers in the service can make the purchase or sale of their own works or others that they have acquired. 
Thanks to the blockchain, at all times you will always know both who is the creator and who is the current owner of the work. 
In addition, a visual part will be developed to help visualize the functionalities of the smart contracts that are developed, using the Next.js framework. 

### Developer 

The developer of this project is [Fernando Suárez](https://github.com/Fer3suarez).


## Installation Manual

1. Download the GitHub repository where the complete project code is located. To do this, a terminal will be opened in the project directory and the following command will be executed:

```
git clone https://github.com/Fer3suarez/TFM

```

2. Assuming that we clone it in the directory named project. We access it from the same terminal with the following command:

```
cd proyecto
```

3. To download all the necessary dependencies for the application to work correctly, we write the following command in the same terminal:

```
npm install
```

4. [Optional] If you want to make changes to the smart contracts, you will need to redeploy the smart contracts on the Ethereum Blockchain testnet you are working on. 
To do this, the following instruction will be executed:

```
npx hardhat run ./scripts/deploy.js –network rinkeby
```

5. [Optional] If you want to deploy the smart contracts on the local network provided by Hardhat, open another terminal and run the following command:

```
npx hardhat node
```

Then in the other terminal, we must write the deployment command in the local network that we just started:

```
npx hardhat run ./scripts/deploy.js –network localhost
```

6. We launch the application in the local environment of our PC by executing the following command:

```
npm run dev
```

With this, opening the web browser at the address http://localhost:8080 we should have the application running, which will necessarily ask to have a Metamask account connected to the Rinkeby network.

7. For the execution of the test package that has been generated to show that the smart contracts perfectly fulfill their function, the following command must be executed:

```
npx hardhat test
```


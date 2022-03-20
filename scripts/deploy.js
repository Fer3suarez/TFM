const hre = require("hardhat");
const fs = require('fs');
const { BigNumber } = require("ethers");

async function main() {
  const NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
  const nftMarket = await NFTMarket.deploy();
  await nftMarket.deployed();
  console.log("Contrato Market desplegado en:", nftMarket.address);

  let config = `
    export const nftmarketaddress = "${nftMarket.address}"
  `

  let data = JSON.stringify(config)
  fs.writeFileSync('config.js', JSON.parse(data))
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

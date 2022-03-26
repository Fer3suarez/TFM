require("@nomiclabs/hardhat-waffle");
const fs = require('fs');

INFURA_PROJECT_ID = "94c34d80a294451da6c8ddbcdbc1b2e4";
METAMASK_PRIVATE_KEY = "f2df8b237a7cacf53cb55b81c2d9adc1a196364383c1cd9dd141175492095f6e";

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`${METAMASK_PRIVATE_KEY}`]
    }
  },
  solidity: {
    version: "0.8.4"
  }
};


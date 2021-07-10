require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./front/src/contracts"
    // artifacts: "./build"
  },
  solidity: "0.8.4",
  networks: {
    // hardhat: {
    //   gas: 3000000,
    //   gasLimit: 600000,
    //   blockGasLimit: 12000000,
    //   allowUnlimitedContractSize: true,
    //   timeout: 1800000,
    //   forking: {
    //     // url: `https://mainnet.infura.io/v3/${process.env.INFURA_ID}`
    //     url: `https://goerli.infura.io/v3/${process.env.INFURA_ID}`
    //   }
    // },
    // goerli: {
    //   url: `https://goerli.infura.io/v3/${process.env.INFURA_ID}`,
    //   accounts: [`${process.env.PRIVATE_KEY}`]
    // },
    mumbai: {
      url: `https://matic-mumbai.chainstacklabs.com`
      // accounts: [`${process.env.PRIVATE_KEY}`]
    },
    local: {
      url: 'http://127.0.0.1:8545/'
    }
  }
};


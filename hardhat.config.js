/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./front/contracts"
  },
  solidity: "0.8.4",
};

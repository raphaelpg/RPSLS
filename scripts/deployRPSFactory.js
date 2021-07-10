async function main() {
  const RPSFactory = await ethers.getContractFactory("RPSFactory");
  const RPSFactoryInstance = await RPSFactory.deploy();

  console.log("RPSFactory deployed to:", RPSFactoryInstance.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

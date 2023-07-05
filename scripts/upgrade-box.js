// manual way
const { developmentChains } = require("../helper-hardhat-config");
const { network, deployments, getNamedAccounts, ethers } = require("hardhat");
const { verify } = require("../utils/verify");

async function main() {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  log("----------------------------------------------------");
  const boxV2 = await deploy("BoxV2", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  // Verify the deployment
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying...");
    await verify(boxV2.address, []);
  }
  // Upgrade!
  // Not "the hardhat-deploy way"
  const boxProxyAdmin = await ethers.getContract("BoxProxyAdmin", deployer);
  const transparentProxy = await ethers.getContract("Box_Proxy");
  const upgradeTx = await boxProxyAdmin.upgrade(
    transparentProxy.address,
    boxV2.address
  );
  await upgradeTx.wait(1);
  const proxyBox = await ethers.getContractAt(
    "BoxV2",
    transparentProxy.address
  );
  const version = await proxyBox.version();
  console.log(`BOX Version: ${version.toString()}`);
  log("----------------------------------------------------");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

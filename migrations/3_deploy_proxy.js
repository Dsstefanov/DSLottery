const DSLottery = artifacts.require("DSLottery");
const ProxyDSLottery = artifacts.require("ProxyDSLottery");

module.exports = async function(deployer, network, accounts) {
    const instance = await DSLottery.deployed();
    await deployer.deploy(ProxyDSLottery, instance.address);
};

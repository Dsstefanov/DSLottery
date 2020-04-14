const DSLottery = artifacts.require("DSLottery");

module.exports = async function(deployer, network, accounts) {
    deployer.deploy(DSLottery, 1);
};

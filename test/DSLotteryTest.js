const truffleAssertions = require('truffle-assertions');
const ProxyDSLottery = artifacts.require('ProxyDSLottery');
const DSLottery = artifacts.require('DSLottery');
contract('DSLottery', async(accounts) => {
    let instance;

    beforeEach(async () => {
        const dSLottery = await DSLottery.new(1);
        const proxy = await ProxyDSLottery.new(dSLottery.address);
        instance = await DSLottery.at(proxy.address);
    });
    //#region participate()
    it('should revert if the user is already in the lottery', async () => {
        const options = {from: accounts[0], value: web3.utils.toWei('1', 'ether')};
        await instance.participate(options);
        truffleAssertions.fails(instance.participate(options), truffleAssertions.ErrorType.REVERT, "ALREADY_PLAYING");
    });

    it('should revert if sent amount is too low', async () => {
        const options = {from: accounts[0], value: web3.utils.toWei('0.00029', 'ether')};
        truffleAssertions.fails(instance.participate(options), truffleAssertions.ErrorType.REVERT, 'BET_TOO_SMALL');
    });

    it('should pass if sent amount is above 0.0003 ether', async () => {
        const options = {from: accounts[0], value: web3.utils.toWei('0.00031', 'ether')};
        truffleAssertions.passes(instance.participate(options));
    })

    //#endregion
});
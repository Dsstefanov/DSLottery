const truffleAssertions = require('truffle-assertions');
const ProxyDSLottery = artifacts.require('ProxyDSLottery');
const DSLottery = artifacts.require('DSLottery');
const assert = require('assert');
contract('DSLottery', async(accounts) => {
    let instance;
    const currentTier = 0;
    const ticketPrice = web3.utils.toWei('0.2', 'ether');

    beforeEach(async () => {
        const dSLottery = await DSLottery.new(currentTier, ticketPrice);
        const proxy = await ProxyDSLottery.new(dSLottery.address);
        instance = await DSLottery.at(proxy.address);
        await instance.setOwner();
        await instance.setCurrentTicketPrice(ticketPrice, {from: accounts[0]});
    });
    //#region participate()
    it('should revert if the user is already in the lottery', async () => {
        const options = {from: accounts[0], value: ticketPrice};
        await instance.participate(options);
        truffleAssertions.fails(instance.participate(options), truffleAssertions.ErrorType.REVERT, "ALREADY_PLAYING");
    });

    xit('should revert if sent amount doesn\'t cover fees', async () => {
        const options = {from: accounts[0], value: web3.utils.toWei('0.00029', 'ether')};
        truffleAssertions.fails(instance.participate(options), truffleAssertions.ErrorType.REVERT, 'BET_TOO_SMALL');
    });

    xit('should revert if sent amount doesn\'t cover ticketPrice + fees', async () => {
        const options = {from: accounts[0], value: web3.utils.toWei(String((parseInt(web3.utils.toWei('0.00029', 'ether')) + parseInt(ticketPrice))), 'wei')};
        truffleAssertions.fails(instance.participate(options), truffleAssertions.ErrorType.REVERT, 'BET_TOO_SMALL');
    });

    it('should pass if sent amount covers ticket price', async () => {
        const options = {from: accounts[0], value: ticketPrice };
        truffleAssertions.passes(instance.participate(options));
    })

    it('should donate excess amount of money', async () => {
        const options = {from: accounts[0], value: web3.utils.toWei(String((parseInt(web3.utils.toWei('0.0003', 'ether')) + parseInt(ticketPrice))), 'wei')};
        const balanceBefore = await web3.eth.getBalance(instance.address);
        const prizeBefore = await instance.getPrizeAmount(0);
        await instance.participate(options);
        const balanceAfter = await web3.eth.getBalance(instance.address);
        const prizeAfter = await instance.getPrizeAmount(0);
        assert.equal(balanceAfter - balanceBefore - (prizeAfter - prizeBefore), web3.utils.toWei('0.0003', 'ether'));
    })
    //#endregion
});

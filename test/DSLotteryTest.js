const truffleAssertions = require('truffle-assertions');
const ProxyDSLottery = artifacts.require('ProxyDSLottery');
const DSLottery = artifacts.require('DSLottery');
contract('DSLottery', async(accounts) => {
    let instance;
    const ticketPrice = web3.utils.toWei('0.2', 'ether');

    beforeEach(async () => {
        const dSLottery = await DSLottery.new(1, ticketPrice);
        const proxy = await ProxyDSLottery.new(dSLottery.address);
        instance = await DSLottery.at(proxy.address);
    });
    //#region participate()
    it('should revert if the user is already in the lottery', async () => {
        const options = {from: accounts[0], value: web3.utils.toWei(String((parseInt(web3.utils.toWei('0.2', 'ether')) + parseInt(web3.utils.toWei('0.1', 'ether')))), 'wei')};
        await instance.participate(options);
        truffleAssertions.fails(instance.participate(options), truffleAssertions.ErrorType.REVERT, "ALREADY_PLAYING");
    });

    it('should revert if sent amount doesn\'t cover fees', async () => {
        const options = {from: accounts[0], value: web3.utils.toWei('0.00029', 'ether')};
        truffleAssertions.fails(instance.participate(options), truffleAssertions.ErrorType.REVERT, 'BET_TOO_SMALL');
    });

    it('should revert if sent amount doesn\'t cover ticketPrice + fees', async () => {
        const options = {from: accounts[0], value: web3.utils.toWei(String((parseInt(web3.utils.toWei('0.00029', 'ether')) + parseInt(web3.utils.toWei('0.1', 'ether')))), 'wei')};
        truffleAssertions.fails(instance.participate(options), truffleAssertions.ErrorType.REVERT, 'BET_TOO_SMALL');
    });

    it('should pass if sent amount covers ticket price + fees', async () => {
        const options = {from: accounts[0], value: web3.utils.toWei(String((parseInt(web3.utils.toWei('0.00031', 'ether')) + parseInt(web3.utils.toWei('0.1', 'ether')))), 'wei')};
        truffleAssertions.passes(instance.participate(options));
    })

    //#endregion
});
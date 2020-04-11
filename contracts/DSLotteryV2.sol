pragma solidity ^0.4.0;

import "./DSLottery.sol";

contract DSLotteryV2 is DSLottery{
	function DSLotteryV2(){
		initialize(msg.sender);
	}

	function initialize(address _owner) public {
		require(!_initialized);
		owner = _owner;
		_initialized = true;
	}
}

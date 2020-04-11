pragma solidity 0.5.12;

import "./Storage.sol";

contract DSLottery is Storage {

	function DSLottery(){

	}

	modifier onlyOwner() {
		require(msg.sender == owner);
		_;
	}

	constructor() public {
		owner = msg.sender;
	}
}

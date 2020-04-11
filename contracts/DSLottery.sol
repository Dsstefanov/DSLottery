pragma solidity 0.5.12;

import "./Storage.sol";

contract DSLottery is Storage {
	modifier onlyOwner() {
		require(msg.sender == owner);
		_;
	}

	modifier costs() {
		require(msg.value >= _uintStorage["minimumParticipationEther"]);
		_;
	}

	constructor() public {
		owner = msg.sender;
		if (_uintStorage["minimumParticipationEther"] == 0) {
			_uintStorage["minimumParticipationEther"] = 0.01 ether;
		}
	}

	// Activates a record that the current user participates in the lottery
	function participate() public payable costs {
		// To be implemented
	}

	// Gets the amount of money that would be awarded to the winner
	function getPrizeAmount() public view returns (uint256 prize){
		return _uintStorage["prize"];
	}

	// Sets the minimal participation payment
	function setMinimumParticipationEther(uint amount) public onlyOwner {
		_uintStorage["minimumParticipationEther"] = amount;
	}

	// Gets the minimal participation price
	function getMinimumParticipationEther() public view returns (uint256 amount) {
		return _uintStorage["minimumParticipationEther"];
	}
}

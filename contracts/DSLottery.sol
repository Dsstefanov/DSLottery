pragma solidity 0.5.12;

import "./Storage.sol";

contract DSLottery is Storage {
	modifier onlyOwner() {
		require(msg.sender == owner);
		_;
	}

	//
	modifier requiresMinimumPayment() {
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
	function participate() public payable requiresMinimumPayment {
		// To be implemented
	}

	// Draws a winner at the end of the tier
	function drawWinner() public {

	}

	// Gets the amount of money that would be awarded to the winner
	function getPrizeAmount() public view returns (uint256 prize){
		return _uintStorage["prize"];
	}

	function resetLottery() private {
		_uintStorage["prize"] = 0;
	}

	// Claim the prize
	function claimPrize() public {
		string memory currentTier = _stringStorage["currentTier"];
		address winner = _addressStorage[currentTier];
		require(winner != address(0), "WINNER_NOT_SELECTED");
		require(winner == msg.sender, "ONLY_WINNER_CAN_CLAIM_PRIZE");
		uint256 amountToSend = getPrizeAmount();
		assert(this.balance >= amountToSend);

		resetLottery();

		msg.sender.transfer(amountToSend);
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

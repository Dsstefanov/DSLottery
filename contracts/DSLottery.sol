pragma solidity 0.5.12;

import "./Storage.sol";

contract DSLottery is Storage {
	// Only owner executable
	modifier onlyOwner() {
		require(msg.sender == _owner);
		_;
	}

	// Verifies the request has at least the minimum amount of money
	modifier requiresMinimumPayment() {
		require(msg.value >= _uintStorage["minimumParticipationEther"]);
		_;
	}

	constructor(uint currentTier) public {
		_owner = msg.sender;
		if (_uintStorage["minimumParticipationEther"] == 0) {
			_uintStorage["minimumParticipationEther"] = 0.01 ether;
		}
		_currentTier = currentTier;
	}

	// Activates a record that the current user participates in the lottery
	function participate() public payable requiresMinimumPayment {
		Tier memory tierParticipants = _tierStorage[_currentTier].participants;
		if (_tierStorage[_currentTier].participantsMapping[msg.sender] == true) {
			revert("ALREADY_PLAYING");
		}
		_tierStorage[_currentTier].participantsArray.push(msg.sender);
		_tierStorage[_currentTier].participantsMapping[msg.sender] = true;
	}

	// Draws a winner at the end of the tier
	function drawWinner() public {
		// TODO implement oracle for generating random number
	}

	// Gets the amount of money that would be awarded to the winner
	function getPrizeAmount(uint tier) public view returns (uint256 prize){
		return _tierStorage[tier].prize;
	}

	// Reset the lottery and start the next tier
	function resetLottery() private {
		_currentTier++;
		// TODO implement functionality based on dates
	}

	// Claim the prize
	function claimPrize(uint tier) public {
		Tier memory tierStruct = _tierStorage[tier];
		address winner = tierStruct.winner;
		require(tierStruct.claimed != true, "PRIZE_ALREADY_CLAIMED");
		require(winner != address(0), "WINNER_NOT_SELECTED");
		require(winner == msg.sender, "ONLY_WINNER_CAN_CLAIM_PRIZE");
		uint256 amountToSend = getPrizeAmount(tier);
		assert(address(this).balance >= amountToSend);

		 _tierStorage[tier].claimed = true;

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

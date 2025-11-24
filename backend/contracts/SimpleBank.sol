// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleBank {
    mapping(address => uint256) public balances;

    function deposit() public payable {
        require(msg.value > 0, "Deposit must be > 0");
        balances[msg.sender] += msg.value;
    }

    // --- NEW FUNCTION ADDED HERE ---
    function withdraw(uint256 _amount) public {
        // 1. Check if they have enough money
        require(balances[msg.sender] >= _amount, "Insufficient funds");

        // 2. Subtract from their balance inside the contract
        balances[msg.sender] -= _amount;

        // 3. Send the ETH back to the user
        // (This is the standard way to send ETH in Solidity)
        (bool success, ) = payable(msg.sender).call{value: _amount}("");
        require(success, "Transfer failed");
    }

    function getBalance() public view returns (uint256) {
        return balances[msg.sender];
    }
}
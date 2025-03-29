// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Lock {
    string[] public names = ["Alice", "Bob", "Charlie"];

    function addName(string memory name) public {
        names.push(name);
    }

    function getNames() public view returns (string[] memory) {
        return names;
    }
}
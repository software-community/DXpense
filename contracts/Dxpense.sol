// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Dxpense {
    string[] public names = ["Alice", "Bob", "Charlie"];
    int16 public random_number = 25;
    address public owner;

    function addName(string memory name) public {
        names.push(name);
    }

    function getNames() public view returns (string[] memory) {
        return names;
    }
}
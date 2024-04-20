// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract HashContract {
    // hash two strings
    function hashString(
        string memory str1,
        string memory str2
    ) public pure returns (bytes32) {
        bytes memory concatenated = abi.encodePacked(str1, str2);
        return sha256(concatenated);
    }
    // hash two byte32
    function hashByte32(
        bytes32 left,
        bytes32 right
    ) public pure returns (bytes32) {
        return sha256(abi.encodePacked(left, right));
    }

    // hash  a single byte
    function hashSingleByte(bytes32 data) public pure returns (bytes32) {
        return sha256(abi.encodePacked(data));
    }

    // Hash a single string
    function hashSingleString(string memory str) public pure returns (bytes32) {
        return sha256(abi.encodePacked(str));
    }
}

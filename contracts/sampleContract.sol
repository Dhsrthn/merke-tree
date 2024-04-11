// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SampleContract {
    string public name;
    string public status;

    constructor(string memory _name) {
        name = _name;
        status = "deploying";
    }
    function setStatus() public {
        status = "live";
    }
}

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "./MerkleTree.sol";

contract ElectionMain {
    function hashFunction(
        string memory str1,
        string memory str2
    ) public pure returns (bytes32) {
        bytes memory concatenated = abi.encodePacked(str1, str2);
        return sha256(concatenated);
    }

    // merkle trees contract
    address private merkleAddress;
    MerkleTree public merkleForest;
    uint public treeID;

    constructor(address _merkleAddress) {
        merkleAddress = _merkleAddress;
        merkleForest = MerkleTree(merkleAddress);
        treeID = merkleForest.initTreeAndGetID();
    }

    // external nullfier
    string public externalNullifer = "external_nullifier";

    struct Candidate {
        address candidateAddress;
        string name;
        uint voteCount;
    }

    struct voter {
        address voterAddress;
        string name;
        bool isExists;
    }

    mapping(uint => Candidate) public candidates;
    mapping(address => voter) public voters;
    uint public candidatesCount;

    // modifiers
    modifier notAlreadyVoter() {
        require(!voters[msg.sender].isExists, "Voter already exists");
        _;
    }

    modifier isVoter() {
        require(voters[msg.sender].isExists, "Voter does not exist");
        _;
    }

    // to-do => add voter to merkle tree, and remove view from registerVoter
    function registerVoter(
        string memory _name,
        string memory _secret
    ) public notAlreadyVoter {
        voter memory newVoter = voter(msg.sender, _name, true);
        voters[msg.sender] = newVoter;
        bytes32 identitySecret = hashFunction(_name, _secret);
        merkleForest.addElement(treeID, identitySecret);
    }

    function getVoterProof(
        string memory _secret
    ) public view isVoter returns (bytes32[] memory, uint[] memory) {
        bytes32 identitySecret = hashFunction(voters[msg.sender].name, _secret);
        (bytes32[] memory path, uint[] memory hashDirection) = merkleForest
            .getElementPath(treeID, identitySecret);
        return (path, hashDirection);
    }

    function getMerkleRoot() public view returns (bytes32) {
        return merkleForest.getRoot(treeID);
    }
}

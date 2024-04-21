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

    uint public status;

    // merkle trees contract
    address private merkleAddress;
    MerkleTree public merkleForest;
    uint public treeID;

    mapping(address => bool) admin;

    constructor(address _merkleAddress) {
        merkleAddress = _merkleAddress;
        merkleForest = MerkleTree(merkleAddress);
        treeID = merkleForest.initTreeAndGetID();
        admin[msg.sender] = true;
        status = 0;
    }

    // external nullfier
    string public externalNullifer = "external_nullifier";

    struct Candidate {
        string name;
        uint voteCount;
        bool exists;
    }

    address[] public candidateKeys;

    struct voter {
        bool isExists;
    }

    mapping(bytes32 => bool) private nullified;

    mapping(address => Candidate) public candidates;
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

    modifier beforeElection() {
        require(status == 0, "Action cannot be done after the election begins");
        _;
    }

    modifier duringElection() {
        require(status == 1, "Action can be done only during the election");
        _;
    }

    modifier afterElection() {
        require(status == 2, "Action can be done only after the election");
        _;
    }

    modifier notNull(bytes32 _leaf) {
        require(!nullified[_leaf], "Already vote cast");
        _;
    }

    modifier isCandidate(address _candidate) {
        require(candidates[_candidate].exists, "Is not a candidate");
        _;
    }

    modifier isNotAlreadyCandidate(address _candidate) {
        require(!candidates[_candidate].exists, "Is not a candidate");
        _;
    }

    modifier isAdmin() {
        require(admin[msg.sender], "Can only be done by admin");
        _;
    }

    function registerVoter(
        bytes32 _identitySecret
    ) public notAlreadyVoter beforeElection {
        voter memory newVoter = voter(true);
        voters[msg.sender] = newVoter;
        merkleForest.addElement(treeID, _identitySecret);
    }

    function getVoterProof(
        bytes32 commitment
    ) public view returns (bytes32[] memory, uint[] memory) {
        (bytes32[] memory path, uint[] memory hashDirection) = merkleForest
            .getElementPath(treeID, commitment);
        return (path, hashDirection);
    }

    function getMerkleRoot() public view returns (bytes32) {
        return merkleForest.getRoot(treeID);
    }

    function isRegisteredVoter(address _addr) public view returns (bool) {
        return voters[_addr].isExists;
    }

    function isRegisteredCandidate(address _addr) public view returns (bool) {
        return candidates[_addr].exists;
    }

    function registerCandidate(
        string memory _name
    ) public beforeElection isNotAlreadyCandidate(msg.sender) {
        Candidate memory newCandidate = Candidate(_name, 0, true);
        candidateKeys.push(msg.sender);
        candidates[msg.sender] = newCandidate;
    }

    function getAllCandidates()
        public
        view
        returns (address[] memory, string[] memory)
    {
        string[] memory nameArray = new string[](candidateKeys.length);
        for (uint i = 0; i < candidateKeys.length; i++) {
            nameArray[i] = candidates[candidateKeys[i]].name;
        }
        return (candidateKeys, nameArray);
    }

    function verifyProof(
        bytes32[] memory _path,
        uint[] memory _hashDirection,
        bytes32 _leaf
    ) public view returns (bool, bool) {
        return (
            merkleForest.verifyPath(1, _path, _hashDirection, _leaf),
            nullified[_leaf]
        );
    }

    function voteCast(bytes32 _leaf) public view returns (bool) {
        return nullified[_leaf];
    }

    function castVote(
        bytes32[] memory _path,
        uint[] memory _hashDirection,
        bytes32 _leaf,
        address _candidate
    ) public notNull(_leaf) isCandidate(_candidate) duringElection {
        if (merkleForest.verifyPath(1, _path, _hashDirection, _leaf)) {
            // a vote is cast, if the given proof is valid, given that the proof wasnt
            // used already
            // making sure the voter exists, and also taking care of double votes
            nullified[_leaf] = true;
            candidates[_candidate].voteCount += 1;
        }
    }

    function tallyVotes()
        public
        view
        afterElection
        returns (string[] memory, uint[] memory)
    {
        string[] memory _names = new string[](candidateKeys.length);
        uint[] memory _votes = new uint[](candidateKeys.length);
        for (uint i = 0; i < candidateKeys.length; i++) {
            _names[i] = candidates[candidateKeys[i]].name;
            _votes[i] = candidates[candidateKeys[i]].voteCount;
        }
        return (_names, _votes);
    }

    // admin funcions
    function startElection(uint _num) public isAdmin returns (uint) {
        status = _num;
        return status;
    }

    function endElection(uint _num) public isAdmin returns (uint) {
        status = _num;
        return status;
    }

    function getElectionStatus() public view returns (uint) {
        return status;
    }

    function checkIfAdmin() public view returns (bool) {
        return admin[msg.sender];
    }

    function getEntireTree() public view returns (bytes32[][] memory tree) {
        return merkleForest.getTree(1);
    }
}

// Application (contract) Flow
// A user registers as a voter and commits themselves to the tree
// Users can register as candidates as-well
// Any user can see list of candidates
// This application skips the verification of personal details of voters/candidates
// for simplicity's sake
// Users, can get their merkle path, on providing the secret
// With any account, users, on providing their identity commitment, and merkle path,
// if it is valid, will be able to cast a vote, ensuring anonymity, as they can
// do this from any throw-away account aswell
// Their commitment on the tree then gets nullified, ensuring
// there are no double-votes

// FLOW AND FUNCTIONS NEEDED
// REGISTER VOTER
// CAST VOTE
// GET PROOF
// VERIFY PROOF
// GET CANDIDATES
// END ELECTION

import Web3 from "web3";
import { getAccount } from "../utils/blockchain.js";
import deployedAddresses from "../../../ignition/deployments/chain-1337/deployed_addresses.json" assert { type: "json" };
import contractAddresses from "../../../ignition/deployments/chain-1337/build-info/cbdf2ce79f3f09c3550c74d4f4daebc4.json" assert { type: "json" };

// Initialize the provider
let web3;
if (window.ethereum) {
  web3 = new Web3(window.ethereum);
  try {
    window.ethereum.enable();
  } catch (error) {
    console.error("User denied account access");
  }
} else if (window.web3) {
  web3 = new Web3(window.web3.currentProvider);
} else {
  console.log(
    "Non-Ethereum browser detected. You should consider trying MetaMask!"
  );
}
// Contract Instances
const electionAbi =
  contractAddresses.output.contracts["contracts/ElectionMain.sol"].ElectionMain
    .abi;

const hashAbi =
  contractAddresses.output.contracts["contracts/HashContract.sol"].HashContract
    .abi;

const electionContract = new web3.eth.Contract(
  electionAbi,
  deployedAddresses["ElectionModule#ElectionMain"]
);

const hashContract = new web3.eth.Contract(
  hashAbi,
  deployedAddresses["ElectionModule#HashContract"]
);

// To handle the account
let account = null;

account = await getAccount();
// ALL BLOCKCHAIN METHODS

// helper hash methods

export async function hashString(str) {
  try {
    const hash = await hashContract.methods.hashSingleString(str).call();
    return hash;
  } catch (error) {
    console.error("Error hashing string:", error);
    return null;
  }
}

export async function hashTwoStrings(str1, str2) {
  try {
    const hash = await hashContract.methods.hashString(str1, str2).call();
    return hash;
  } catch (error) {
    console.error("Error hashing two strings:", error);
    return null;
  }
}

export async function hashByte32(byte) {
  try {
    const hash = await hashContract.methods.hashSingleByte(byte).call();
    return hash;
  } catch (error) {
    console.error("Error hashing byte32:", error);
    return null;
  }
}

export async function hashTwoByte32(byte1, byte2) {
  try {
    const hash = await hashContract.methods.hashByte32(byte1, byte2).call();
    return hash;
  } catch (err) {
    console.log("Error hashing the given byte32 values", err);
    return null;
  }
}

// election contract methods

export async function registerVoter(sec) {
  try {
    await electionContract.methods.registerVoter(sec).send({
      from: account,
    });
    return true;
  } catch (error) {
    console.error("Error registering voter:", error);
    return false;
  }
}

export async function getVoterProof(commitment) {
  try {
    const proof = await electionContract.methods
      .getVoterProof(commitment)
      .call();
    // [path] , [hashDirection]
    return proof;
  } catch (error) {
    console.error("Error getting voter proof:", error);
    return null;
  }
}

export async function getAllCandidates() {
  try {
    const candidates = await electionContract.methods.getAllCandidates().call();
    // [address],[names]
    return candidates;
  } catch (error) {
    console.error("Error getting all candidates", error);
    return null;
  }
}

export async function castVote(path, hashDirection, commitment, candidate) {
  try {
    await electionContract.methods
      .castVote(path, hashDirection, commitment, candidate)
      .send({ from: account });
    return true;
  } catch (error) {
    console.error("Error casting vote", error);
    return false;
  }
}

export async function verifyVoterProof(path, hashDirection, committment) {
  try {
    const res = await electionContract.methods
      .verifyProof(path, hashDirection, committment)
      .call();
    return res;
  } catch (error) {
    console.error("Error verifying voter proof:", error);
    return false;
  }
}

export async function getMerkleRoot() {
  try {
    const root = await electionContract.methods.getMerkleRoot().call();
    return root;
  } catch (error) {
    console.error("Error getting merkle root:", error);
    return null;
  }
}

export async function registerCandidate(name) {
  try {
    await electionContract.methods
      .registerCandidate(name)
      .send({ from: account });
    return true;
  } catch (error) {
    console.error("Error registering candidate", error);
    return false;
  }
}

export async function tallyVotes() {
  try {
    const res = await electionContract.methods.tallyVotes().call();
    return res;
  } catch (err) {
    console.error("Error tallying votes", err);
    return null;
  }
}

//admin methods

export async function checkAdmin() {
  try {
    const res = await electionContract.methods
      .checkIfAdmin()
      .call({ from: account });
    return res;
  } catch (err) {
    console.error("Error checking if admin", err);
    return null;
  }
}

export async function startTheElection() {
  try {
    await electionContract.methods.startElection(1).send({ from: account });
    return true;
  } catch (err) {
    console.error("Error starting the election", err);
    return null;
  }
}

export async function endTheEletion() {
  try {
    await electionContract.methods.endElection(2).send({ from: account });
    return true;
  } catch (err) {
    console.error("Error ending the election", err);
    return null;
  }
}

export async function electionStatus() {
  try {
    const res = await electionContract.methods.getElectionStatus().call();
    return res;
  } catch (err) {
    console.error("Error getting election status", err);
    return null;
  }
}

export async function tallyElectionVotes() {
  try {
    const res = await electionContract.methods.tallyVotes().call();
    return res;
  } catch (err) {
    console.error("Error tallying votes", err);
    return null;
  }
}

export async function isAVoter() {
  try {
    const res = await electionContract.methods
      .isRegisteredVoter(account)
      .call();
    return res;
  } catch (err) {
    console.error("Error checking if voter", err);
    return false;
  }
}

export async function isACandidate() {
  try {
    const res = await electionContract.methods
      .isRegisteredCandidate(account)
      .call();
    return res;
  } catch (err) {
    console.error("Error checking if candidate", err);
    return false;
  }
}

export async function getMerkleTree() {
  try {
    const tree = electionContract.methods.getEntireTree().call();
    return tree;
  } catch (err) {
    console.log("Error while getting the tree", err);
    return null;
  }
}

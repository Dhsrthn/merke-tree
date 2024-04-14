import Web3 from "web3";
import { getAccounts } from "../utils/utils.js";
import deployedAddresses from "../../../ignition/deployments/chain-1337/deployed_addresses.json" assert { type: "json" };
import contractAddresses from "../../../ignition/deployments/chain-1337/build-info/2b34fa845a75db25dea6f4495f61c3de.json" assert { type: "json" };

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

function handleAccountChange(newAccount) {
  account = newAccount;
}

account = getAccounts(handleAccountChange);

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

// election contract methods

export async function registerVoter(name, secret) {
  try {
    const res = await electionContract.methods
      .registerVoter(name, secret)
      .send({
        from: account,
      });
    console.log(res);
    return true;
  } catch (error) {
    console.error("Error registering voter:", error);
    return false;
  }
}

export async function getVoterProof(secret) {
  try {
    const proof = await electionContract.methods.getVoterProof(secret).call();
    return proof;
  } catch (error) {
    console.error("Error getting voter proof:", error);
    return null;
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

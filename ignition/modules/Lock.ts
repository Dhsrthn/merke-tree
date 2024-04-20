import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const merkleModule = buildModule("MerkleTree", (m) => {

  const merkleContract = m.contract("MerkleTree", []);

  return { merkleContract };
});

export default buildModule("ElectionModule", (m) => {

  const { merkleContract } = m.useModule(merkleModule);
  console.log(process.argv)
  // in minutes (for testing)

  const electionContract = m.contract("ElectionMain", [merkleContract]);

  const hashContract = m.contract("HashContract", []);
  console.log(hashContract, "deployed");

  return { electionContract, hashContract };
});

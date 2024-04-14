import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const merkleModule = buildModule("MerkleTree", (m) => {

  const merkleContract = m.contract("MerkleTree", []);

  return { merkleContract };
});

export default buildModule("ElectionModule", (m) => {

  const { merkleContract } = m.useModule(merkleModule);

  const electionContract = m.contract("ElectionMain", [merkleContract]);

  const hashContract = m.contract("HashContract", []);

  return { electionContract, hashContract };
});

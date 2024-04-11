
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("Deployer", (m) => {
  const sample = m.contract("SampleContract",["contract"]);

  m.call(sample, "setStatus", []);

  return { sample };
});

import Web3 from "web3";

export function detectProvider() {
  let provider;
  if (window.ethereum) {
    provider = window.ethereum;
  } else if (window.web3) {
    provider = window.web3.currentProvider;
  } else {
    console.log("Non- ethereum browser detected.");
  }
  return provider;
}
export async function getAccount() {
  const currentProvider = detectProvider();
  if (currentProvider) {
    await currentProvider.request({ method: "eth_requestAccounts" });
    const web3 = new Web3(currentProvider);
    const userAccounts = await web3.eth.getAccounts();
    return userAccounts[0];
  }
}

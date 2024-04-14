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
export async function getAccounts(callback) {
  const currentProvider = detectProvider();
  if (currentProvider) {
    try {
      await currentProvider.request({ method: "eth_requestAccounts" });

      const web3 = new Web3(currentProvider);

      currentProvider.on("accountsChanged", async function (accounts) {
        if (accounts.length > 0) {
          callback(accounts[0]);
        } else {
          console.error("No accounts found.");
          callback(null);
        }
      });

      const userAccounts = await web3.eth.getAccounts();

      if (userAccounts.length > 0) {
        callback(userAccounts[0]);
      } else {
        console.error("No accounts found.");
        callback(null);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
      callback(null);
    }
  } else {
    console.error("No provider detected.");
    callback(null);
  }
}

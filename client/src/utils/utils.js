import { hashTwoByte32 } from "../blockchain/methods";

export function generateSecret() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let secret = "";
  const charLength = characters.length;

  for (let i = 0; i < 32; i++) {
    const randomIndex = Math.floor(Math.random() * charLength);
    secret += characters[randomIndex];
  }

  return secret;
}

export function arraysToJson(path, hashDirection) {
  const data = {
    path: path.map(String),
    hashDirection: hashDirection,
  };
  const replacer = (key, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };

  return JSON.stringify(data, replacer);
}

export function JsontoArrays(jsonData) {
  const data = JSON.parse(jsonData);
  return {
    path: data.path,
    hashDirection: data.hashDirection,
  };
}


export async function verifyProof(path, hashOrder, root, leaf) {
  let hashedString = leaf;
  for (let i = 0; i < path.length; i++) {
    if (hashOrder[i] == 0) {
      const res = await hashTwoByte32(path[i], hashedString);
      if (res) {
        hashedString = res;
      } else {
        console.log("An error occurred while hashing");
        return false;
      }
    } else {
      const res = await hashTwoByte32(hashedString, path[i]);
      if (res) {
        hashedString = res;
      } else {
        console.log("An error occurred while hashing");
        return false;
      }
    }
  }
  return root == hashedString;
}

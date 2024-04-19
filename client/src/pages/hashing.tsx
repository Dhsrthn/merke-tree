import { hashByte32 } from "../blockchain/methods";
import { useEffect, useState } from "react";
import Header from "../components/header";
import toast, { Toaster } from "react-hot-toast";

const Hashing = () => {
  const [secret, setSecret] = useState<string>("");
  const [commitment, setCommitement] = useState<string>("");
  const [reveal, setReveal] = useState<boolean>(false);

  const getCommitment = async () => {
    const res = await hashByte32(secret);
    if (res) {
      //@ts-expect-error type not found
      setCommitement(res);
    }
  };

  useEffect(() => {
    setReveal(true);
  }, [commitment]);

  return (
    <div className="font-clashDisplay font-bold  h-screen w-screen flex flex-col justify-evenly items-center bg-black text-white">
      <Toaster />
      <div className="h-[10%] w-full items-center justify-center flex p-1 absolute top-0">
        <Header />
      </div>
      <div className="flex flex-col justify-around h-[35vh] items-center ">
        <span className="text-6xl font-heavy bg-clip-text text-transparent bg-gradient-to-r from-[#ffe3b7]/[0.47] to-[#ffe3b7] select-none mb-[88px]">
          Get your Commitment
        </span>
        <p className="text-[18px] font-semibold">
          Enter your secret to get your identity commitment
        </p>
        <input
          type="text"
          value={secret}
          onChange={(e) => {
            setSecret(e.target.value);
          }}
          placeholder="Identity Secret"
          className="border-input text-black
          bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-[80%] rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <button
          className="ring-offset-background focus-visible:ring-ring flex h-10 w-[80%] items-center justify-center whitespace-nowrap rounded-md bg-white px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          onClick={getCommitment}
        >
          Get Commitment
        </button>
        <div>
          <span>Your Identity commitment is:</span>
          {reveal && <span> Hello : {` HI ${commitment}`}</span>}
        </div>
      </div>
    </div>
  );
};

export default Hashing;

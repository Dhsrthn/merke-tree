import { useState } from "react";
import { getVoterProof, verifyVoterProof } from "../blockchain/methods";
import { JsontoArrays, arraysToJson } from "../utils/utils";
import Header from "../components/header";
import toast, { Toaster } from "react-hot-toast";

const MerkleVerifier = () => {
  const [commitment, setCommitement] = useState<string>("");


  const [proof, setProof] = useState<string[]>([]);
  const [hashDirection, setHashDirection] = useState<number[]>([]);

  const [pathUploaded, setPathUploaded] = useState<string[]>([]);
  const [hashDirectionUploaded, setHashDirectionUploaded] = useState<number[]>(
    []
  );

  const handleGetProof = async () => {
    const res = await getVoterProof(commitment);
    if (res) {
      if (Array.isArray(res["0"]) && Array.isArray(res["1"])) {
        setProof(res["0"]);
        setHashDirection(res["1"]);
        toast("Proof generated successfully!");
      }
    }
  };

  const handleVerifyProof = async () => {
    console.log("called");
    if (commitment === "") {
      toast.error("Please enter a commitment");
      return;
    }
    const res = await verifyVoterProof(
      pathUploaded,
      hashDirectionUploaded,
      commitment
    );
    console.log(res);
    if (res) {
      if (res[0]) {
        toast("The given proof is true!");
        if (res[1]) {
          toast.error("This voter has already voted!");
        }
      } else {
        toast("The given proof is false!");
      }
    } else {
      toast("The given proof is false!");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const jsonData = reader.result as string;
        const { path, hashDirection } = JsontoArrays(jsonData);
        if (path && Array.isArray(path)) {
          setPathUploaded(path);
        }
        if (hashDirection && Array.isArray(hashDirection)) {
          setHashDirectionUploaded(hashDirection);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFileDownload = async () => {
    if (proof.length === 0 || hashDirection.length === 0) {
      toast.error("No proof found!");
      toast("Get proof first!")
      return;
    }
    console.log(proof, hashDirection);
    const json = arraysToJson(proof, hashDirection);
    const blob = new Blob([json], { type: "applications/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "proof.json";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="font-clashDisplay font-bold  h-screen w-screen flex flex-col justify-evenly items-center bg-black text-white">
      <Toaster />
      <div className="h-[10%] w-full items-center justify-center flex p-1 absolute top-0">
        <Header />
      </div>
      <div className="flex flex-col justify-around h-[58vh] items-center w-[35vw] ">
        <span className="text-6xl font-heavy bg-clip-text text-transparent bg-gradient-to-r from-[#ffe3b7]/[0.47] to-[#ffe3b7] select-none mb-[50px]">
          Get Proof
        </span>
        <input
          type="text"
          placeholder="Enter your commitment"
          className="border-input text-black
          bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-[80%] rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={commitment}
          onChange={(e) => {
            setCommitement(e.target.value);
          }}
        />
        <button
          className="ring-offset-background focus-visible:ring-ring flex h-10 w-[80%] items-center justify-center whitespace-nowrap rounded-md bg-white px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          onClick={(e) => {
            e.preventDefault();
            handleGetProof();
          }}
        >
          Get Proof
        </button>
        <button
          className="ring-offset-background focus-visible:ring-ring flex h-10 w-[80%] items-center justify-center whitespace-nowrap rounded-md bg-white px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          onClick={(e) => {
            e.preventDefault();
            handleFileDownload();
          }}
        >
          Download Proof
        </button>

        <span className="text-6xl font-heavy bg-clip-text text-transparent bg-gradient-to-r from-[#ffe3b7]/[0.47] to-[#ffe3b7] select-none mb-[40px] mt-[60px]">
          Verify Proof
        </span>
        <input type="file" onChange={handleFileUpload} />
        <button
          className="ring-offset-background focus-visible:ring-ring flex h-10 w-[80%] items-center justify-center whitespace-nowrap rounded-md bg-white px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          onClick={(e) => {
            e.preventDefault();
            handleVerifyProof();
          }}
        >
          Verify Proof
        </button>
      </div>
    </div>
  );
};

export default MerkleVerifier;

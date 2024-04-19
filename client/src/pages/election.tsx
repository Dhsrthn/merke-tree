import { useEffect, useState } from "react";
import {
  registerVoter,
  hashTwoStrings,
  registerCandidate,
  getAllCandidates,
  verifyVoterProof,
  castVote,
  isAVoter,
  isACandidate,
} from "../blockchain/methods";
import { JsontoArrays, generateSecret } from "../utils/utils";
import Header from "../components/header";
import toast, { Toaster } from "react-hot-toast";

const ElectionPage = () => {
  const [voter, setVoter] = useState(false);
  const [isCandidate, setIsCandidate] = useState(false);

  const [name, setName] = useState("");
  const [secret, setSecret] = useState("");

  const [showVoterReg, setShowVoterReg] = useState(true);

  const [candidateNames, setCandidateNames] = useState<string[]>([
    "Kavin",
    "Dhasarathan",
  ]);
  const [candidateAddress, setCandidateAddress] = useState<string[]>([]);
  const [selectedCand, setSelectedCand] = useState<string>("Kavin");
  const [commitment, setCommitement] = useState<string>("");

  const [path, setPath] = useState<string[]>([]);
  const [hashDirection, setHashDirection] = useState<number[]>([]);

  const [verified, setVerified] = useState<boolean>(false);

  const [verificationScreen, setVerificationScreen] = useState<boolean>(false);

  const handleVerifyProof = async () => {
    const res = await verifyVoterProof(path, hashDirection, commitment);
    if (res) {
      if (res[1] == true) {
        toast("You have already casted your vote!");
      }
      if (res[0] && !res[1]) {
        setVerified(true);
      }
    } else {
      toast("Verification Failed!");
    }
  };

  const handleRegisterVoter = async () => {
    const sec = generateSecret();
    const idenSec = await hashTwoStrings(name, sec);
    if (idenSec == void 0 || Array.isArray(idenSec) || idenSec == null) {
      console.log("Error in hashing");
    } else {
      setSecret(idenSec as string);
    }
    const res = await registerVoter(idenSec);
    if (res) {
      downloadSecret();
      toast("Voter Registration Success!");
    } else {
      toast("Voter Registration Failed!");
    }
  };

  const downloadSecret = async () => {
    const json = JSON.stringify({
      secret: secret,
      message:
        "This is your identity secret. Store it safe! Do not share it with anyone",
    });
    const blob = new Blob([json], { type: "applications/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "secret.json";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleRegisterCandidate = async () => {
    const res = await registerCandidate(name);
    if (res) {
      setIsCandidate(true);
      toast("Candidate Registration Success!");
    } else {
      toast("Candidate Registration Failed!");
    }
  };

  const handleGetCandidates = async () => {
    const res = await getAllCandidates();
    if (res) {
      console.log(res);
      if (res[1] != null && Array.isArray(res[1])) {
        setCandidateNames(res[1]);
      }
      if (res[0] != null && Array.isArray(res[0])) {
        setCandidateAddress(res[0]);
      }
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
          setPath(path);
        }
        if (hashDirection && Array.isArray(hashDirection)) {
          setHashDirection(hashDirection);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleCastVote = async () => {
    const res = await castVote(path, hashDirection, commitment, selectedCand);
    if (res) {
      toast("Vote casted successfully!");
      setVerificationScreen(false);
      setVerified(false);
    } else {
      toast("Couldn't cast vote!");
    }
  };
  const checkIfVoter = async () => {
    const res = await isAVoter();
    if (res) {
      setVoter(true);
      setShowVoterReg(false);
    } else {
      setVoter(false);
    }
  };

  const checkIfCandidate = async () => {
    const res = await isACandidate();
    if (res) {
      setIsCandidate(true);
    } else {
      setIsCandidate(false);
    }
  };

  useEffect(() => {
    handleGetCandidates();
    checkIfCandidate();
    checkIfVoter();
  }, []);

  useEffect(() => {
    if (secret != "") {
      setShowVoterReg(true);
    }
  }, [secret]);

  return (
    <div className="font-clashDisplay font-bold  h-screen w-screen flex flex-col justify-evenly items-center bg-black text-white">
      <Toaster />
      <div className="h-[10%] w-full items-center justify-center flex p-1 absolute top-0">
        <Header />
      </div>
      <div className="bg-white text-black font-sans absolute right-[7vw] top-[50%] -translate-y-1/2">
        <div className="flex py-[100px] px-[30px] flex-col items-center justify-center">
          <div className="max-h-auto mx-auto max-w-xl">
            {(!voter || !isCandidate) && (
              <>
                <div className="mb-8 space-y-3">
                  {!voter && showVoterReg && (
                    <>
                      <p className="text-xl font-semibold text-black">
                        Voter Registration
                      </p>
                      <p className="text-gray-500">
                        Ready to vote? Let's get you registered! It's that easy.{" "}
                        <br />
                        Your voice matters!!
                      </p>
                    </>
                  )}
                  {!isCandidate && !showVoterReg && (
                    <>
                      <p className="text-xl font-semibold">
                        Candidate Registration
                      </p>
                      <p className="text-gray-500">
                        Ready to lead? Cool . Register as a candidate now!
                        <br />
                        Make your mark.
                      </p>
                    </>
                  )}
                </div>
                <form className="w-full">
                  <div className="mb-10 space-y-3">
                    <div className="space-y-1">
                      <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Name
                        </label>
                        <input
                          className="border-input 
                                  bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          id="name"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                          }}
                          placeholder="Your Name"
                        />
                      </div>
                    </div>
                    {!voter && showVoterReg && (
                      <>
                        <button
                          className="ring-offset-background focus-visible:ring-ring flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                          onClick={handleRegisterVoter}
                          disabled={voter}
                        >
                          Register As voter
                        </button>
                      </>
                    )}
                    {!isCandidate && !showVoterReg && (
                      <>
                        <button
                          className="ring-offset-background focus-visible:ring-ring flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                          onClick={handleRegisterCandidate}
                        >
                          Register As Candiate
                        </button>
                      </>
                    )}
                  </div>
                </form>

                {!voter && showVoterReg && (
                  <>
                    <div className="text-center text-black">
                      {" "}
                      Want to Participate in Election ?{" "}
                      <button
                        className="text-blue-500"
                        onClick={() => {
                          setShowVoterReg(false);
                        }}
                      >
                        Register
                      </button>{" "}
                    </div>
                  </>
                )}
                {!isCandidate && !showVoterReg && (
                  <>
                    <div className="text-center">
                      {" "}
                      Wanna be a Voter?{" "}
                      <button
                        className="text-blue-500"
                        onClick={() => {
                          setShowVoterReg(true);
                        }}
                      >
                        Register
                      </button>{" "}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="border h-[70vh] rounded-lg w-[30vw] py-[30px] flex flex-col justify-evenly items-center absolute top-[50%] left-[15vw] -translate-y-1/2">
        <div className=" h-full w-full text-center flex flex-col items-center transition-all">
          <span className="text-4xl font-heavy bg-clip-text text-transparent bg-gradient-to-r from-[#ffe3b7]/[0.47] to-[#ffe3b7] select-none mb-[40px]">
            CANDIDATES
          </span>
          {candidateNames.map((name, index) => {
            return (
              <div
                key={index}
                className="flex w-[80%] items-center justify-around border rounded-lg px-2 py-3 mb-[20px]"
              >
                <span>
                  {index + 1}
                  {")"}
                  {name}
                </span>
                <button
                  className="border rounded-lg px-2 py-1 bg-gradient-to-r from-[#ffe3b7]/[0.47] to-[#ffe3b7] text-white"
                  onClick={() => {
                    setVerificationScreen(true);
                    setSelectedCand(candidateAddress[index]);
                  }}
                >
                  Vote
                </button>
              </div>
            );
          })}
        </div>
      </div>
      {verificationScreen && (
        <>
          <div className="absolute h-[100vh] w-[1000vw] bg-black bg-opacity-90"></div>
          <div className="absoulte left-[50vw] top-[50vh] z-10 ">
            <div className="flex flex-col ml-10 border justify-around h-[40vh] py-[40px] px-[20px] rounded-lg ">
              <span className="text-4xl font-heavy bg-clip-text text-transparent bg-gradient-to-r from-[#ffe3b7]/[0.47] to-[#ffe3b7] select-none mb-[40px]">
                Verification Screen
              </span>
              <span className="text-l font-semibold text-left text-white">
                Get your Voter Proof from the Get_Proof page
              </span>
              <input
                type="text"
                className="border-input
                text-black
                bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter your Proof"
                onChange={(e) => {
                  setCommitement(e.target.value);
                }}
              />
              <input type="file" onChange={handleFileUpload} />
              <button
                onClick={handleVerifyProof}
                className="ring-offset-background focus-visible:ring-ring flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-white px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                Verify
              </button>
            </div>
          </div>
        </>
      )}
      {verified && selectedCand != "" && (
        <>
          <div className="absolute h-[100vh] w-[1000vw] bg-black bg-opacity-80"></div>
          <div className="border flex flex-col items-center z-10  py-[40px] px-[20px] rounded-lg ">
            <span className="text-4xl font-heavy bg-clip-text text-transparent bg-gradient-to-r from-[#ffe3b7]/[0.47] to-[#ffe3b7] select-none mb-[30px]">
              Confirmation
            </span>
            <span className="text-[20px] font-semibold text-left text-white">
              Are you sure you want to vote for{" "}
              <span className="text-[30px] text-stone-400">{selectedCand}</span>
              {" ?"}
            </span>
            <button
              className="ring-offset-background focus-visible:ring-ring flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-white px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 mt-[10px]"
              onClick={handleCastVote}
            >
              Proceed and Vote
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ElectionPage;

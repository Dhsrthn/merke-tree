import { useEffect, useState } from "react";
import { registerVoter, hashTwoStrings, registerCandidate, getAllCandidates, verifyVoterProof, castVote, isAVoter, isACandidate } from "../blockchain/methods";
import { JsontoArrays, generateSecret } from "../utils/utils";
import Header from "../components/header";
import toast, { Toaster } from "react-hot-toast";

const ElectionPage = () => {

    const [voter, setVoter] = useState(false);
    const [isCandidate, setIsCandidate] = useState(false);

    const [name, setName] = useState("");
    const [secret, setSecret] = useState("");


    const [showVoterReg, setShowVoterReg] = useState(true);

    const [candidateNames, setCandidateNames] = useState<string[]>([]);
    const [candidateAddress, setCandidateAddress] = useState<string[]>([]);
    const [selectedCand, setSelectedCand] = useState<string>("");
    const [commitment, setCommitement] = useState<string>('');

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
    }

    const handleRegisterVoter = async () => {
        const sec = generateSecret();
        const idenSec = await hashTwoStrings(name, sec)
        if (idenSec == void 0 || Array.isArray(idenSec) || idenSec == null) {
            console.log("Error in hashing");
        } else {
            setSecret(idenSec as string);
        }
        const res = await registerVoter(idenSec);
        if (res) {
            downloadSecret();
            toast("Voter Registration Success!")
        } else {
            toast("Voter Registration Failed!")
        }

    }

    const downloadSecret = async () => {
        const json = JSON.stringify({ secret: secret, message: "This is your identity secret. Store it safe! Do not share it with anyone" });
        const blob = new Blob([json], { type: 'applications/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'secret.json';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    }

    const handleRegisterCandidate = async () => {
        const res = await registerCandidate(name);
        if (res) {
            setIsCandidate(true);
            toast("Candidate Registration Success!")
        } else {
            toast("Candidate Registration Failed!")
        }

    }

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
    }

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
            }
            reader.readAsText(file);
        }
    }

    const handleCastVote = async () => {
        const res = await castVote(path, hashDirection, commitment, selectedCand);
        if (res) {
            toast("Vote casted successfully!");
            setVerificationScreen(false);
            setVerified(false);
        } else {
            toast("Couldn't cast vote!");
        }

    }
    const checkIfVoter = async () => {
        const res = await isAVoter();
        if (res) {
            setVoter(true);
            setShowVoterReg(false);
        } else {
            setVoter(false);
        }
    }

    const checkIfCandidate = async () => {
        const res = await isACandidate();
        if (res) {
            setIsCandidate(true);
        } else {
            setIsCandidate(false);
        }
    }

    useEffect(() => {
        handleGetCandidates();
        checkIfCandidate();
        checkIfVoter();
    }, [])

    useEffect(() => {
        if (secret != "") {
            setShowVoterReg(true);
        }
    }, [secret])

    return (<div className="font-clashDisplay font-bold  h-screen w-screen flex flex-col justify-evenly items-center bg-black text-white relative">
        <Toaster />
        <div className="h-[10%] w-full items-center justify-center flex p-1">
            <Header />

        </div>
        <div className="h-[90%] w-full flex flex-col justify-evenly items-center">

            <span className="text-2xl font-light bg-clip-text text-transparent bg-gradient-to-r from-[#ffe3b7]/[0.47] to-[#ffe3b7] select-none">
                REGISTRATION
            </span>
            <div className="w-[60%] flex flex-col items-center h-[25%] justify-around">
                {
                    (!voter || !isCandidate) && <>
                        <span className="font-light text-xl">Enter your name</span>
                        <div className="w-[50%]">
                            <input type="text" className="text-xl font-clashDisplay font-normal bg-clip-text text-transparent bg-gradient-to-r from-[#ffe3b7]/[0.47] to-[#ffe3b7] border-b-2 focus:border-[#ffc05b] focus:outline-none caret-slate-100 w-full" value={name} onChange={(e) => {
                                setName(e.target.value);
                            }} />
                        </div>
                        {
                            !voter && showVoterReg && <>
                                <div className="flex flex-col w-full items-center h-[40%] justify-around ">
                                    <div className="flex w-[50%] justify-around ">

                                        <button onClick={handleRegisterVoter} disabled={voter} className="h-8 w-[80%] rounded-3xl border-2 border-[#C19E66] hover:bg-[#c19e66] hover:text-black portrait:w-[75%] portrait:h-14 fade-in-text z-20">Register As Voter</button>
                                        {
                                            !isCandidate && <button onClick={() => {
                                                setShowVoterReg(false);
                                            }}>
                                                {">"}
                                            </button>
                                        }
                                    </div>
                                </div>
                            </>
                        }
                        {
                            !isCandidate && !showVoterReg && <>
                                <div className="flex flex-col w-full items-center h-[40%] justify-around ">
                                    <div className="flex w-[50%] justify-around ">
                                        {
                                            !voter && <button onClick={() => {
                                                setShowVoterReg(true);
                                            }}>
                                                {"<"}
                                            </button>
                                        }
                                        <button onClick={handleRegisterCandidate} className="h-8 w-[80%] rounded-3xl border-2 border-[#C19E66] hover:bg-[#c19e66] hover:text-black portrait:w-[75%] portrait:h-14 fade-in-text z-20">Register Candidate</button>
                                        {/* Register Candidate */}</div>
                                </div>


                            </>
                        }

                    </>
                }
            </div>

            <div className="flex border w-full h-[50%] overflow-y-auto  justify-around items-center">
                <div className="border h-full w-[50%] text-center flex flex-col justify-around transition-all">
                <span className="text-4xl font-light bg-clip-text text-transparent bg-gradient-to-r from-[#ffe3b7]/[0.47] to-[#ffe3b7] select-none">
                CANDIDATES
            </span>
                    {candidateNames.map((name, index) => {
                        return (<div key={index} className="flex flex-col">
                            <span>{name}</span>
                            <button onClick={() => {
                                setVerificationScreen(true);
                                setSelectedCand(candidateAddress[index]);
                            }}>Vote</button>
                        </div>);

                    })}
                </div>
                {
                    verificationScreen && <>
                        <div className="flex flex-col ml-10">
                            <span>Verification Screen</span>
                            <span>Enter your Proof</span>
                            <span>You can get your voter proof from the get proof page</span>
                            <input type="text" className="border" onChange={(e) => {
                                setCommitement(e.target.value);
                            }} />
                            <input type="file" onChange={handleFileUpload} />
                            <button onClick={handleVerifyProof} className="border">Verify</button>
                        </div>

                    </>
                }
                {
                    verified && selectedCand != "" &&
                    <>
                        <span>Confirmation</span>
                        <span>Are you sure you want to vote for {selectedCand}</span>
                        <button onClick={handleCastVote}>Proceed and vote</button>
                    </>
                }

            </div>
        </div>
    </div>);
}

export default ElectionPage;
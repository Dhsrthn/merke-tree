import { useEffect, useState } from "react";
import { registerVoter, hashTwoStrings, registerCandidate, getAllCandidates, verifyVoterProof, castVote, isAVoter, isACandidate, hashByte32 } from "../blockchain/methods";
import { JsontoArrays, generateSecret } from "../utils/utils";

const ElectionPage = () => {

    const [voter, setVoter] = useState(false);
    const [isCandidate, setIsCandidate] = useState(false);

    const [name, setName] = useState("");
    const [secret, setSecret] = useState("");
    const [reveal, setReveal] = useState(false);

    const [registered, setRegistered] = useState<boolean | null>();
    const [candRegistered, setCandRegistered] = useState<boolean | null>();

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
            //@ts-expect-error not found in types
            if (res[1] == true) {
                alert("You have already casted your vote!");
            }
            //@ts-expect-error not found in types
            if (res[0] && !res[1]) {
                setVerified(true);
            }
        } else {
            alert("Verification Failed!");

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
            setRegistered(true);
            setCandRegistered(null);
            downloadSecret();
        } else {
            setRegistered(false);
            setCandRegistered(null);
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
            setCandRegistered(true);
            setRegistered(null);
            setIsCandidate(true);
        } else {
            setCandRegistered(false);
            setRegistered(null);
        }

    }

    const handleGetCandidates = async () => {
        const res = await getAllCandidates();
        if (res) {
            //@ts-expect-error not found in types
            if (res[1] != null && Array.isArray(res[1])) {
                //@ts-expect-error not found in types
                setCandidateNames(res[1]);
            }
            //@ts-expect-error not found in types
            if (res[0] != null && Array.isArray(res[0])) {
                //@ts-expect-error not found in types
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
            alert("Vote casted successfully!");
            setVerificationScreen(false);
            setVerified(false);
        } else {
            alert("Couldn't cast vote!");
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
            setReveal(true);
            setShowVoterReg(true);
        }
    }, [secret])

    return (<div>
        Election Main Page
        <div className="border">
            {
                (!voter || !isCandidate) && <>
                    <span>Enter your name</span>
                    <div>
                        <input type="text" className="border" value={name} onChange={(e) => {
                            setName(e.target.value);
                        }} />
                    </div>
                    {
                        !voter && showVoterReg && <>
                            <div className="flex flex-col">
                                <span>VOTER REGISTRATION</span>
                                <button onClick={handleRegisterVoter} disabled={voter}>Register Voter</button>
                                {reveal && registered &&
                                    <>
                                        <span>This is your identity secret</span>
                                        <span>Store this safe somewhere!</span>
                                        <span>{secret}</span>
                                    </>}
                                {registered != null && registered &&
                                    <span>Registration Successful!</span>
                                }
                                {registered != null && !registered &&
                                    <>
                                        <span>Registration Failed!</span>
                                        <span>Note: You cannot register twice or after the election has started!</span>
                                    </>
                                }
                                {/* Register Voter */}
                            </div>
                            {
                                !isCandidate && <button onClick={() => {
                                    setShowVoterReg(false);
                                }}>
                                    {">"}
                                </button>
                            }


                        </>
                    }
                    {
                        !isCandidate && !showVoterReg && <>
                            <div className="flex flex-col">
                                {/* Register Candidate */}
                                <span>CANDIDATE REGISTRATION</span>
                                <button onClick={handleRegisterCandidate}>Register Candidate</button>
                                {candRegistered != null && candRegistered &&
                                    <span>Registration as candidate Successful!</span>
                                }
                                {candRegistered != null && !candRegistered &&
                                    <span>Registration as candidate Failed!</span>
                                }
                            </div>
                            {
                                !voter && <button onClick={() => {
                                    setShowVoterReg(true);
                                }}>
                                    {"<"}
                                </button>
                            }

                        </>
                    }

                </>
            }
        </div>

        <div className="flex">
            <div>
                <span>Candidates</span>
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
    </div>);
}

export default ElectionPage;
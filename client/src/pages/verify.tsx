import {  useState } from "react";
import { getVoterProof, verifyVoterProof } from "../blockchain/methods";
import { JsontoArrays, arraysToJson } from "../utils/utils";

const MerkleVerifier = () => {

    const [commitment, setCommitement] = useState<string>('');

    const [verified, setVerified] = useState<boolean | null>(null);
    const [alreadyVoted, setAlreadyVoted] = useState<boolean>(false)

    const [proof, setProof] = useState<string[]>([]);
    const [hashDirection, setHashDirection] = useState<number[]>([]);

    const [pathUploaded, setPathUploaded] = useState<string[]>([]);
    const [hashDirectionUploaded, setHashDirectionUploaded] = useState<number[]>([]);

    const handleGetProof = async () => {
        const res = await getVoterProof(commitment);
        if (res) {
            //@ts-expect-error not found in types
            if (Array.isArray(res["0"]) && Array.isArray(res["1"])) {
                //@ts-expect-error not found in types
                setProof(res["0"]);
                //@ts-expect-error not found in types
                setHashDirection(res["1"]);
            }
        }
    }

    const handleVerifyProof = async () => {
        const res = await verifyVoterProof(pathUploaded, hashDirectionUploaded, commitment);
        if (res) {
            //@ts-expect-error not found in types
            if (res[0])
                setVerified(true);
            //@ts-expect-error not found in types
            if (res[1]) {
                setAlreadyVoted(true);
            }
        } else {
            setVerified(false);
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
                    setPathUploaded(path);
                }
                if (hashDirection && Array.isArray(hashDirection)) {
                    setHashDirectionUploaded(hashDirection);
                }
            }
            reader.readAsText(file);
        }
    }

    const handleFileDownload = async () => {
        console.log(proof, hashDirection)
        const json = arraysToJson(proof, hashDirection);
        const blob = new Blob([json], { type: 'applications/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'proof.json';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    }


    return (<div className="h-screen w-screen">
        <div className="border flex flex-col">
            <span>Get Proof</span>
            <input type="text" placeholder="Enter your commitment" value={commitment} onChange={(e) => {
                setCommitement(e.target.value);
            }} />
            <button onClick={handleGetProof}>Get Proof</button>
            <button onClick={handleFileDownload}>Download Proof</button>
        </div>
        {/* GetProof */}
        <button onClick={handleVerifyProof} className="border">Verify Proof</button>
        {/* VerifyProof */}
        <input type="file" className="z-50 border" onChange={handleFileUpload} />
        {
            verified != null && <>
                {
                    verified ? <>
                        The given proof is true
                        {alreadyVoted && "This voter has already voted!"}
                    </> : <>
                        The given proof is false
                    </>
                }
            </>
        }
    </div>);
}

export default MerkleVerifier;
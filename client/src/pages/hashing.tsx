import { hashByte32 } from "../blockchain/methods";
import { useEffect, useState } from "react";

const Hashing = () => {

    const [secret, setSecret] = useState<string>('');
    const [commitment, setCommitement] = useState<string>('');
    const [reveal, setReveal] = useState<boolean>(false);

    const getCommitment = async () => {
        const res = await hashByte32(secret);
        if (res) {
            //@ts-expect-error type not found
            setCommitement(res);
        }
    }

    useEffect(() => {
        setReveal(true);
    }, [commitment])

    return (
        <div className="h-screen w-screen flex flex-col">
            <span>Get your commitment</span>
            <input type="text" value={secret} onChange={(e) => {
                setSecret(e.target.value);

            }}
                placeholder="Enter your identity secret to get your identity commitment"
            />
            <button onClick={getCommitment}>Get Commitment</button>
            <span>Your Identity commitment is:</span>
            {reveal && <span> Hello : {` HI ${commitment}`}</span>}
        </div>
    );
}

export default Hashing;
import { useEffect, useState } from "react";
import { tallyElectionVotes } from "../blockchain/methods";

const Results = () => {

    const [candidateName, setCandidateNames] = useState<string[]>([]);
    const [CandidateVotes, setCandidateVotes] = useState<number[]>([]);

    const [success, setSuccess] = useState(false);

    const getResults = async () => {
        const res = await tallyElectionVotes();
        if (res) {
            setSuccess(true);
            //@ts-expect-error not found in types
            if (res[0] != null && Array.isArray(res[0])) {
                //@ts-expect-error not found in types
                setCandidateNames(res[0]);
            }
            //@ts-expect-error not found in types
            if (res[1] != null && Array.isArray(res[1])) {
                //@ts-expect-error not found in types
                setCandidateVotes(res[1]);
            }
        } else {
            setSuccess(false);
        }
    }

    useEffect(() => {
        getResults();
    }, [])

    return (<div>
        {!success && <>
            The election is not over
        </>}

        {
            success && <>
                {candidateName.map((name, index) => {
                   return ( <div key={index} >


                        <span>{name}</span>
                        <span> Votes: {`${CandidateVotes[index]}`}</span>
                    </div>)

                })}
            </>
        }
    </div>);
}

export default Results;
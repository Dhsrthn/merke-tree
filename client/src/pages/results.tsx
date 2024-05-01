import { useEffect, useState } from "react";
import { tallyElectionVotes } from "../blockchain/methods";
import Header from "../components/header";
import  { Toaster } from "react-hot-toast";

const Results = () => {
  const [candidateName, setCandidateNames] = useState<string[]>([]);
  const [CandidateVotes, setCandidateVotes] = useState<number[]>([]);

  const [success, setSuccess] = useState(false);

  const getResults = async () => {
    const res = await tallyElectionVotes();
    if (res) {
      setSuccess(true);
      if (res[0] != null && Array.isArray(res[0])) {
        setCandidateNames(res[0]);
      }
      if (res[1] != null && Array.isArray(res[1])) {
        setCandidateVotes(res[1]);
      }
    } else {
      setSuccess(false);
    }
  };

  useEffect(() => {
    getResults();
  }, []);

  return (
    <div className="font-clashDisplay font-bold  h-screen w-screen flex flex-col justify-evenly items-center bg-black text-white">
      <Toaster />
      <div className="h-[10%] w-full items-center justify-center flex p-1 absolute top-0">
        <Header />
      </div>
      {!success && (
        <p className="font-bold text-[50px]">The election is not over</p>
      )}

      {success && (
        <>
          {candidateName.map((name, index) => {
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
                  className="border rounded-lg px-2 py-1 bg-gradient-to-r from-[#ffe3b7]/[0.47] to-[#ffe3b7] text-black"

                >
                  Votes: {`${CandidateVotes[index]}`}
                </button>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default Results;

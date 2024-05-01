import { useEffect } from "react";
import { checkAdmin, startTheElection, endTheEletion, electionStatus } from "../blockchain/methods";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import toast, { Toaster } from "react-hot-toast";
const Admin = () => {
    const navigate = useNavigate();

    const adminCheck = async () => {
        const res = await checkAdmin();
        if (!res) {
            navigate("/");
        }
    }

    const getStatus = async () => {
        const res = await electionStatus();
        if (res) {
            if (res == 0) {
                toast("The election has not started yet!");
            } else if (res == 1) {
                toast("The election is going on!");
            } else if (res == 2) {
                toast("The election has ended!")
            }
        }
    }

    useEffect(() => {
        adminCheck();
    }, [])

    const start = async () => {
        const res = await startTheElection();
        if (res) {
            toast("Election started!");
        }
    }

    const end = async () => {
        const res = await endTheEletion();
        if (res) {
            toast("Ended the election!")
        }
    }

    return (<div className="font-clashDisplay font-bold  h-screen w-screen flex  justify-evenly items-center bg-black text-white">
        <Toaster />
        <div className="h-[10%] w-full items-center justify-center flex p-1 absolute top-0">
            <Header />
        </div>
        {/* Admin Page */}
        <button className="border rounded-lg px-10 py-3 bg-gradient-to-r from-[#ffe3b7]/[0.47] to-[#ffe3b7] text-white" onClick={(e) => {
            e.preventDefault();
            start();
        }} >Start</button>
        <button className="border rounded-lg px-10 py-3 bg-gradient-to-r from-[#ffe3b7]/[0.47] to-[#ffe3b7] text-white" onClick={(e) => {
            e.preventDefault();
            end();
        }}>End</button>
        <button className="border rounded-lg px-10 py-3 bg-gradient-to-r from-[#ffe3b7]/[0.47] to-[#ffe3b7] text-white" onClick={(e) => {
            e.preventDefault();
            getStatus();
        }} >Status</button>
    </div >);
}

export default Admin;
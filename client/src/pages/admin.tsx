import { useEffect } from "react";
import { checkAdmin, startTheElection, endTheEletion, electionStatus } from "../blockchain/methods";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
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
        console.log(res);
    }

    useEffect(() => {
        adminCheck();
    }, [])

    const start = async () => {
        await startTheElection();
    }

    const end = async () => {
        await endTheEletion();
    }

    return (<div className="font-clashDisplay font-bold  h-screen w-screen flex flex-col justify-evenly items-center bg-black text-white">
        <div className="h-[10%] w-full items-center justify-center flex p-1 absolute top-0">
            <Header />
        </div>
        {/* Admin Page */}
        <button onClick={(e) => {
            e.preventDefault();
            start();
        }} >Start</button>
        <button onClick={(e) => {
            e.preventDefault();
            end();
        }}>End</button>
        <button onClick={(e) => {
            e.preventDefault();
            getStatus();
        }} >Status</button>
    </div >);
}

export default Admin;
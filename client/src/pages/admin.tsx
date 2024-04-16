import { useEffect } from "react";
import { checkAdmin, startTheElection, endTheEletion } from "../blockchain/methods";
import { useNavigate } from "react-router-dom";
const Admin = () => {
    const navigate = useNavigate();

    const adminCheck = async () => {
        const res = await checkAdmin();
        if (!res) {
            navigate("/");
        }
    }
    useEffect(() => {
        async function check() {
            await adminCheck();
        }
        check();

    }, [])

    const start = async () => {
        await startTheElection();
    }

    const end = async () => {
        await endTheEletion();
    }

    return (<div>
        {/* Admin Page */}
        <button onClick={start} >Start</button>
        <button onClick={end} >End</button>
    </div>);
}

export default Admin;
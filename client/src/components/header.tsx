import { useNavigate } from "react-router-dom";
const Header = () => {
    const navigate = useNavigate();
    return (
        <div className="h-full w-[80%] rounded-xl flex items-center p-2 portrait:w-[98%]">
            <div className="w-1/2 items-center flex ">
                <span
                    className="text-2xl portrait:text-sm hover:cursor-pointer font-clashDisplay font-bold hover:text-white/[0.6]"
                    onClick={() => {
                        navigate("/");
                    }}
                >
                    Vox-Populi
                </span>
            </div>
            <div className="w-1/6 portrait:hidden"></div>
            <div className="w-2/4 text-xl portrait:text-[0.7rem] flex justify-around font-normal text-right font-archivo  portrait:w-3/5">
                <span
                    className="bg-clip-text text-transparent bg-gradient-to-r from-[#ffe3b7]/[0.47] to-[#ffe3b7] hover:text-white hover:cursor-pointer"
                    onClick={() => {
                        navigate("/election");
                    }}
                >
                    ELECTION
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ffe3b7]/[0.47] to-[#ffe3b7] hover:text-white hover:cursor-pointer"
                    onClick={async () => {
                        navigate("/commitment");
                    }}>
                    GET-COMMITMENT
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ffe3b7]/[0.47] to-[#ffe3b7] hover:text-white hover:cursor-pointer"
                    onClick={() => {
                        navigate("/verification");
                    }}>
                    GET/VERIFY-PROOF
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ffe3b7]/[0.47] to-[#ffe3b7] hover:text-white hover:cursor-pointer" onClick={() => {
                    navigate("/results");
                }}>
                    RESULTS
                </span>

            </div>
        </div>
    );
};

export default Header;


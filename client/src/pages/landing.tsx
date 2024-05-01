import Header from "../components/header";

const Landing = () => {
    return (
        <div className="font-clashDisplay font-bold  h-screen w-screen flex flex-col justify-center items-center bg-black text-white relative">
            <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] scale-150">
                <img src="/ethereum.svg" alt="" />

            </div>

            <div className="h-[10%] w-full items-center justify-center flex p-1 ">
                <Header />

            </div>
            <div className="h-[90%] w-full flex flex-col justify-around items-center text- z-20">
                <div className="h-[60%] w-full flex flex-col justify-around items-center portrait:h-[50%]">
                    <span className="text-8xl portrait:text-4xl">
                        Vote anonymously
                    </span>
                    <div className="flex flex-col w-[60%] justify-around items-center mb-12 text-4xl font-archivo font-light portrait:text-lg min-h-20 ">
                        <span>Your voice matters.</span>
                        <span>Do not be afraid to use it!</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;

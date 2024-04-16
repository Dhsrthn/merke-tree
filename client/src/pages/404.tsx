const NotFound = () => {
    return (<div className="h-screen w-screen bg-black text-white flex flex-col justify-around items-center" >
        <div className="flex flex-col items-center h-[50%] w-[50%] justify-center">
            <span className="text-9xl font-bold">404</span>
            <span className="text-5xl font-semibold">Page not found {":("}</span>
        </div>
        <a href="/">
            <button>GO HOME</button>
        </a>

    </div>);
}

export default NotFound;
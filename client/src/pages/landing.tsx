import { registerVoter } from "../blockchain/methods";

const Landing = () => {
    const name = "hello";
    const secret = "123"

    async function registerVoterHandler() {
        const val = await registerVoter(name, secret);
        if (val) {
            console.log("Success!")
        } else {
            console.log("Failure");
        }
    }

    return (<>
        <button onClick={registerVoterHandler}>CLICKME</button>
    </>);
}

export default Landing;
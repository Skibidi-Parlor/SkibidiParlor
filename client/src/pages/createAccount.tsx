const CreateAccount = () => {

    const createAccount = async (event: React.FormEvent<HTMLFormElement>) => { 

        console.log("skibidi");

    }

    return(
    <div className="bg-[#B9C0DA] min-w-screen min-h-screen flex flex-col items-center ">
        <div className="flex flex-col justify-center w-[90vw] lg:w-[35vw] p-5 mt-[2rem] items-center bg-white rounded-lg">

            <form onSubmit={createAccount} className="w-full space-y-5">

                <h1 className="text-4xl font-bold text-center mt-[1.5rem]">
                    Create Account
                </h1>

                <div>
                    <p className="text-[1.5rem] font-bold mt-[2rem]">email</p>
                    <input className="w-full border-b-1 focus:outline-none mt-[0.5rem]" type="email" required></input>
                </div>

                <div>
                    <p className="text-[1.5rem] font-bold mt-[1rem]">password</p>
                    <input className="w-full border-b-1 focus:outline-none mt-[0.5rem]" type="password" required></input>
                </div>

                <div>
                    <p className="text-[1.5rem] font-bold mt-[1rem]">re-enter password</p>
                    <input className="w-full border-b-1 focus:outline-none mt-[0.5rem]" type="password" required></input>
                </div>

                <div>
                    <p className="text-[1.5rem] font-bold mt-[1rem]">username</p>
                    <input className="w-full border-b-1 focus:outline-none mt-[0.5rem]" required></input>
                </div>

                <div>
                    <p className="text-[1.5rem] font-bold mt-[1rem]">nickname</p>
                    <input className="w-full border-b-1 focus:outline-none mt-[0.5rem]"></input>
                </div>

                <div className="flex justify-center mt-[2rem]">
                    <button 
                        type="submit"
                        className="bg-[#FE7F2D] hover:bg-[#e35a01] text-white font-bold py-2 px-4 rounded-lg text-[1.5rem] cursor-pointer">Login
                    </button>
                </div>
            </form>

        </div>
    </div>);
};

export default CreateAccount;
const CreateAccount = () => {

    return(
    <div className="bg-[#B9C0DA] min-w-screen min-h-screen flex flex-col items-center ">
        <h1 className="text-7xl font-bold text-center mt-[2rem]">
            Skibidi Parlor
        </h1>
        <div className="h-[60vh] w-[90vw] lg:h-[60vh] lg:w-[35vw] bg-white rounded-md p-[1rem] flex flex-col mt-auto mb-auto p-8">
            <p className="text-[1.7rem] font-bold mt-[1rem]">username</p>
            <input className="border-b-1 focus:outline-none focus:border-b-2 mt-[1rem]"></input>

            <p className="text-[1.7rem] mt-[2rem] font-bold pt-[.6rem]">password</p>
            <input
            type="password"
            className="border-b-1 focus:outline-none focus:border-b-2 mt-[1rem]"
            ></input>

            <p className="text-[1.7rem] mt-[2rem] font-bold pt-[.6rem]">re-enter password</p>
            <input
            type="password"
            className="border-b-1 focus:outline-none focus:border-b-2 mt-[1rem]"
            ></input>

            <button className="w-[50%] h-[12.5%] bg-[#FE7F2D] hover:bg-[#e35a01] text-white rounded-lg self-center mt-auto text-[2.3rem] font-semibold">
            Login
            </button>
        </div>
    </div>);
};

export default CreateAccount;
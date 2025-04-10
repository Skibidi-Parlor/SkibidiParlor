const Login = () => {
  return (
    <div className="bg-[#B9C0DA] min-w-screen min-h-screen flex flex-col items-center ">
      <h1 className="text-7xl font-bold text-center mt-[2rem]">
        Skibidi Parlor
      </h1>
      <div className="h-[60vh] w-[90vw] lg:h-[60vh] lg:w-[35vw] bg-white rounded-md p-[1rem] flex flex-col mt-auto mb-auto p-8">
        <p className="text-3xl font-bold mt-[4rem]">username</p>
        <input className="border-b-1 focus:outline-none focus:border-b-2 mb-4 mt-4"></input>
        <p className="text-3xl mt-4 font-bold pt-2">password</p>
        <input
          type="password"
          className="border-b-1 focus:outline-none focus:border-b-2 mt-4"
        ></input>
        <button className="w-[50%] h-[12.5%] bg-[#FE7F2D] hover:bg-[#e35a01] text-white rounded-lg self-center mt-auto text-4xl font-semibold">
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;

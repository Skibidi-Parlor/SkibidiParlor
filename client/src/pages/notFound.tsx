import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-linear-to-b from-[#7134DD] to-[#AF9CCF] min-w-screen min-h-screen flex flex-col items-center text-center">
      <h1 className="text-9xl mt-30">404</h1>
      <h2 className="text-7xl mt-5">Page Not Found</h2>
      <h3
        className="px-2 py-4 bg-white rounded-xl mt-10"
        onClick={() => {
          navigate("/");
        }}
      >
        Take Me Back Home
      </h3>
    </div>
  );
};

export default NotFound;

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("isAdmin")) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <div className="bg-linear-to-b h-screen from-[#7134DD] to-[#AF9CCF] min-w-screen min-h-screen flex flex-col items-center text-center"></div>
  );
};

export default Admin;

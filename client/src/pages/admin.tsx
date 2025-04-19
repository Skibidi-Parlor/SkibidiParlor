import { useState, useEffect } from "react";
import { UserModel } from "../../shared/src/models";
import { trpc } from "../api";
import ShouldBeLoggedIn from "../helpers/ShouldBeLoggedIn";

const Admin = () => {
  ShouldBeLoggedIn(true);

  const [users, setUsers] = useState<UserModel[]>([]);
  const currentUserId = Number(localStorage.getItem("userID"));

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = (await trpc.user.all.query()) as UserModel[];
        setUsers(res.filter((u) => u.id !== currentUserId));
      } catch (error) {
        alert("Unable to fetch user's collection" + error);
      }
    };
    fetchUsers();
  }, [currentUserId]);

  const giveAdmin = async (id: number) => {
    if (!confirm("Are you sure you want to make this user an admin?")) return;
    try {
      await trpc.user.update.mutate({ id, isAdmin: true });
      window.location.reload();

      alert("User is now an admin.");
    } catch (error) {
      alert("Failed to toggle admin status: " + error);
    }
  };

  const removeAdmin = async (id: number) => {
    if (!confirm("Are you sure you want to remove this user's admin status?"))
      return;
    try {
      await trpc.user.update.mutate({ id, isAdmin: false });
      window.location.reload();
      alert("User is no longer an admin.");
    } catch (error) {
      alert("Failed to toggle admin status: " + error);
    }
  };

  const deleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await trpc.user.delete.mutate(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      alert("User deleted successfully.");
    } catch (error) {
      alert("Failed to delete user: " + error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#7134DD] to-[#AF9CCF] min-w-screen min-h-screen flex flex-col items-center p-4 text-white">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center mt-10">
        User Management
      </h1>
      <div className="w-full max-w-4xl space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white text-black rounded-2xl p-4 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div className="flex flex-col">
              <span className="font-semibold text-lg">{user.username}</span>
              <span className="text-sm text-gray-500">{user.email}</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={() =>
                  user.isAdmin ? removeAdmin(user.id) : giveAdmin(user.id)
                }
                className={`${
                  user.isAdmin ? "bg-purple-300" : "bg-purple-500"
                } text-white px-4 py-2 rounded-xl hover:bg-purple-600 w-full sm:w-auto`}
              >
                {user.isAdmin ? "Remove Admin" : "Make Admin"}
              </button>
              <button
                onClick={() => deleteUser(user.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 w-full sm:w-auto"
              >
                Delete User
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;

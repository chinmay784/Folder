import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserAppContext } from "../context/UserAppContext";

const NavBar = () => {
  const { user, logout } = useContext(UserAppContext);

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <h1 className="text-lg font-bold">MERN App</h1>
      <div>
        {user ? (
          <div className=" flex items-center justify-center gap-4">
            <img src={user.profilePic} className=" w-10 h-10 rounded-full mb-3" />
            <Link to="/profile" className="mr-4">Profile</Link>
            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/signup" className="mr-4">Signup</Link>
            <Link to="/login" className="bg-blue-500 px-3 py-1 rounded">Login</Link>
            <Link to="/forgot-password" className="ml-4 text-yellow-300">Forgot Password?</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;

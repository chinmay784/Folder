import { useState, useContext } from "react";
import axios from "axios";
import { UserAppContext } from "../context/UserAppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginPage = () => {
  const { login } = useContext(UserAppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    try {
      const res = await axios.post("https://folder-1.onrender.com/api/auth/login", { email, password });
      login(res.data.token, res.data.user);
      navigate("/");
      toast.success("Login successful")
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      toast.error("Login faild");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-3">Login</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-2 border rounded-lg mb-2"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-2 border rounded-lg mb-2"
      />
      <button onClick={handleLogin} className="bg-green-500 text-white px-4 py-2 rounded-lg">
        Login
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default LoginPage;

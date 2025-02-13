import { useState, useContext } from "react";
import axios from "axios";
import { UserAppContext } from "../context/UserAppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignupPage = () => {
  const { login } = useContext(UserAppContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", { name, email, password });
      login(res.data.token, res.data.user);
      navigate("/verify-otp", { state: { email } }); // Redirect to profile page
      toast.success("Signup successful")
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
      toast.error("Signup faild");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-3">Signup</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="w-full p-2 border rounded-lg mb-2"
      />
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
      <button onClick={handleSignup} className="bg-green-500 text-white px-4 py-2 rounded-lg">
        Signup
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default SignupPage;

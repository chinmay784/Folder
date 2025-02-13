import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    setMessage("");
    setError("");
    try {
      const res = await axios.post("https://folder-gxr1.onrender.com/api/auth/request-password-reset", { email });
      setMessage(res.data.message);
      navigate("/reset-password");
      toast.success("OTP sent to your email");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
      toast.error("Failed to send OTP")
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-3">Forgot Password</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="w-full p-2 border rounded-lg mb-2"
      />
      <button onClick={handleSendOTP} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
        Send OTP
      </button>
      {message && <p className="text-green-500 mt-2">{message}</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default ForgotPasswordPage;

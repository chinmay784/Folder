import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // Get email from navigation state

  const handleVerifyOTP = async () => {
    setMessage("");
    setError("");

    if (!email) {
      setError("Email is missing. Please try signing up again.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp,
      });

      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 2000); // Redirect to login after successful verification
      toast.success("OTP verified successfully");
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
      toast.error("OTP verification faild")
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold text-center mb-4">Verify OTP</h2>
        <p className="text-gray-600 text-sm text-center mb-4">
          Enter the OTP sent to your email: <strong>{email}</strong>
        </p>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleVerifyOTP}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-200"
        >
          Verify OTP
        </button>

        {message && <p className="text-green-500 mt-3 text-center">{message}</p>}
        {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default VerifyOTP;

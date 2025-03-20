import { useContext, useState } from "react";
import axios from "axios";
import { UserAppContext } from "../context/UserAppContext";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { user, token, setUser } = useContext(UserAppContext);
  const [name, setName] = useState(user?.name || "");
  const [profilePic, setProfilePic] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpdate = async () => {
    try {
      const res = await axios.get(
        "https://folder-1.onrender.com/api/auth/profile",
        { name },
        { headers: { Authorization: `${token}` } }
      );
      setUser(res.data);
      setMessage("Profile updated successfully!");
      toast.success("Profile updated successfully!")
    } catch (error) {
      setMessage("Failed to update profile.");
      toast.error("Faild to update profile")
    }
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const res = await axios.post("https://folder-gxr1.onrender.com/api/auth/upload-profile-pic", formData, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setUser(res.data);
      setMessage("Profile picture updated successfully!");
      toast.success("Profile picture updated successfully!")
    } catch (error) {
      setMessage("Failed to update profile picture.");
      toast.error("Failed to update profile picture.")
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-3">Profile</h2>
      {user?.profilePic && <img src={user.profilePic} alt="Profile" className="w-24 h-24 rounded-full mb-3" />}
      <input type="file" onChange={handleProfilePicUpload} className="mb-2" />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="w-full p-2 border rounded-lg mb-2"
      />
      <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
        Update Profile
      </button>
      {message && <p className="text-green-500 mt-2">{message}</p>}
    </div>
  );
};

export default ProfilePage;

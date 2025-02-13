const express = require("express");
const { registerUser, verifyOTP, loginUser, uploadProfilePic, requestPasswordReset, resetPassword, geminiPrompt, profile, getAllchats } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const { upload } = require("../config/cloudinary");
const User = require("../models/User");
const router = express.Router();


router.post("/signup", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginUser);
router.post("/upload-profile-pic", authMiddleware, upload.single("profilePic"), uploadProfilePic);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.get("/profile", authMiddleware, profile);
router.post("/search", authMiddleware, geminiPrompt);
router.get("/allsearch", getAllchats)


module.exports = router;

// http://localhost:5000/api/auth/signup
// http://localhost:5000/api/auth/verify-otp
// http://localhost:5000/api/auth/login
// http://localhost:5000/api/auth/upload-profile-pic ( in ths route you have to provide in headers Authorization: your_token and also give profilepic in body as form-data)
// http://localhost:5000/api/auth/request-password-reset
// http://localhost:5000/api/auth/reset-password
// http://localhost:5000/api/auth/profile (In headers you have to give Authorization: your_token)
// http://localhost:5000/api/auth/search  (In headers you have to give Authorization: your_token)
// http://localhost:5000/api/auth/allsearch
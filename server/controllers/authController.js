const User = require("../models/User");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const run = require("../geminiApi");
const ChatSave = require("../models/ChatSave");
require("dotenv").config();

// Email Transporter Setup (Nodemailer)
const transporter = nodemailer.createTransport({
    service: "Gmail",
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Signup Controller
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, profilePic } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate OTP
        const otp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 mins

        // Create new user
        user = new User({
            name,
            email,
            password: hashedPassword,
            otp,
            otpExpires,
            profilePic: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`
        });

        await user.save();

        // Send OTP via email
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: "Verify Your Email - OTP",
            text: `Your OTP for email verification is: ${otp}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: "User registered. Check email for OTP." });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "User not found" });

        // Check if OTP is correct and not expired
        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Update user as verified
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({ message: "OTP verified. Account activated!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(400).json({ message: "Please verify your email first" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate JWT Token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({ message: "Login successful", token, user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



exports.uploadProfilePic = async (req, res) => {
    try {
        const userId = req.user.userId; // Extract user ID from JWT
        const imageUrl = req.file.path; // Cloudinary URL

        // Update user profile
        const user = await User.findByIdAndUpdate(userId, { profilePic: imageUrl }, { new: true });

        res.json({ message: "Profile picture updated", profilePic: user.profilePic });
    } catch (error) {
        res.status(500).json({ message: "Error uploading image", error: error.message });
    }
};




exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 mins

        // Update user with OTP
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        // Send OTP via email
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is: ${otp}`,
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: "OTP sent to email" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "User not found" });

        // Check if OTP is valid
        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password & clear OTP
        user.password = hashedPassword;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({ message: "Password reset successful. You can now log in." });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};




exports.geminiPrompt = async (req, res) => {
    try {
        // Extract token from headers
        const token = req.header("Authorization");
        if (!token) {
            return res.status(401).json({ success: false, message: "Access Denied: No token provided" });
        }

        // Verify token
        const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = verified;

        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ success: false, message: "Prompt is required" });
        }

        const userId = req.user.userId;

        // Call the Gemini API
        const response = await run(prompt);
        // Find existing user searches
        let usersearch = await ChatSave.findOne({ userId });

        if (!usersearch) {
            usersearch = new ChatSave({ userId, searches: [{ query: prompt, result: response }] });
        } else {
            usersearch.serches.unshift({ query: prompt, result: response });
        }

        await usersearch.save();

        return res.json({
            success: true,
            message: "Search saved successfully",
            response,
            usersearch,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


exports.getAllchats = async (req, res) => {
    try {
       
        // Extract token from headers
        const token = req.header("Authorization");
        if (!token) {
            return res.status(401).json({ success: false, message: "Access Denied: No token provided" });
        }

        // Verify token
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);

        if (!decoded || !decoded.userId) {
            return res.status(401).json({ success: false, message: "Invalid token or userId missing" });
        }

        req.user = decoded;
        const userId = req.user.userId;


        // Find all saved searches for the user
        const userSearches = await ChatSave.findOne({ userId });

        if (!userSearches) {
            return res.status(404).json({ success: false, message: "No search history found" });
        }

        return res.json({
            success: true,
            message: "Search history retrieved successfully",
            searches: userSearches.serches, // Send only the searches array
        });



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}



exports.profile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
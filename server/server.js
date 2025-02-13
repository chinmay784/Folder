const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { DbConnect } = require("./dataBase/dbConnection");
const authRoutes = require("./routes/authRoutes")
const chatRoutes = require("./routes/chatRoute")
dotenv.config();// Load environment variables
const path = require("path");

const app = express();

const _dirname = path.resolve();

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

// Connect to MongoDB
DbConnect()

// app.get("/", (req, res) => {
//   res.send("MERN Auth Backend Running...");
// });

// Routes
app.use("/api/auth", authRoutes);

app.use(express.static(path.join(_dirname, "/client/dist")));
app.get('*',(req,res)=>{
  res.sendFile(path.resolve(_dirname,"client","dist","index.html"))
});

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
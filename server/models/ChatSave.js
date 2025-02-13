const mongoose = require("mongoose");


const chatSaveSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    serches: [
        {
            query: { type: String, required: true },
            result: { type: String, required: true }, // Store result along with query
            createdAt: { type: Date, default: Date.now },
        }
    ]
});

module.exports = mongoose.model("ChatSave", chatSaveSchema);
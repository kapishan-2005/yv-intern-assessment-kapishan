const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password:{
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["MEMBER","OFFICER","CHAIRMAN"],
            default: "MEMBER",
        },
        officerRoleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "officerRole",
            default: null,
        },
    },
    {timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
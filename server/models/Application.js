const mongoose = require("mongoose");
const applicationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        applicantType: {
            type: String,
            enum: ["INDIVIDUAL", "COMPANY"],
            required: true,
        },
        fullName:{
            type: String,
        },
        companyName: {
            type: String,
        },
        nicOrRegNo: {
            type: String,
        },
         email:{
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        }, 
        membershipType:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Membershiptype",
            required: true,
        },
        status: {
            type: String,
            enum:["PENDING","APPROVED","REJECTED"],
            default: "PENDING",
        },
        rejectionReason: {
            type: String,
            default: null,
        },
         reviewedBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
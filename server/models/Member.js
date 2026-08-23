const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(

    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required: true,
        },
        applicationId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Application",
            required: true,
        },
         membershipNo:{
            type: String,
            required: true,
            unique: true,
        },
        status:{
            type: String,
            enum: ["ACTIVE","INACTIVE"],
            default: "ACTIVE",
        },
    }, 
    {timestamps: true}
);

module.exports = mongoose.model("member",memberSchema);
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");

const seedChairman = async () =>{
    try{
        await connectDB();
        const exitingChairman = await User.findOne({role: "CHAIRMAN"});

        if (exitingChairman){
            console.log("chairman already exits:", exitingChairman.email);
            process.exit();
        }
         const salt=await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash("chairman123",salt);

         const chairman = await User.create({
            name:"yv Chairman",
            email: "chairman@yv.com",
            password: hashedPassword,
            role: "CHAIRMAN",
         });

         console.log("Chairman account created successfully:");
         console.log("Email:", chairman.email);
         console.log("Password: chairman123");
         process.exit();
         
    }
     catch(error) {
        console.error("Error seeding chairman", error.message);
        process.exit(1);
    }
};

seedChairman();
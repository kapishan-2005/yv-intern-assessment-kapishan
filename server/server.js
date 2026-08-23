require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const applicationRoutes = require("./routes/applicationRoutes")
const roleRoutes = require("./routes/roleRoutes");
const userRoutes = require("./routes/useRoutes")

connectDB();
const app=express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/users",userRoutes)
app.get("/",(req,res) => {
    res.send("API running");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
});
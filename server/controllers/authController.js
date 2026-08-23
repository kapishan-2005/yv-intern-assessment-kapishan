const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register a new user
const registerUser = async (req,res) => {
    try{
        const {name,email,password} = req.body;
        if (!name || !email || !password){
            return res.status(400).json({message: "please provide name, email and password"});
        }
      
        //check if user already exit
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: "User email already exits"})
        }

        //hash password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        //generate JWT token
        const token = jwt.sign(
            {
                id: newUser.id,
                role: newUser.role
            },
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );
        
        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            token,
        });
    }
    catch(error) {
        res.status(500).json({message: "server error", error: error.message});
    }
};

//login exit user
const loginUser = async (req,res) => {
    try{
        const{email,password} = req.body;
        if (!email || !password){
            return res.status(400).json({message: "please provide email and password"});
        }

    //find user email
        const user = await User.findOne({email});
        if (!user) {
            return res.status(401).json({message: "invalid email or password"});
            
        }

       //entered password match hashed password
        const isMatch = await bcrypt.compare(password,user.password);
        if (!isMatch){
            return res.status(401).json({message: "invalid email or password"});
        }

        //generate JWT token
       const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );
        
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });
    }
    catch(error) {
        res.status(500).json({message: "server error", error: error.message});
    }
};

module.exports = {registerUser,loginUser};
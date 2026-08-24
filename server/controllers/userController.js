const User = require("../models/User");
const officerRole = require("../models/officerRole");
const logAction = require("../services/auditService");

const assignOfficerRole = async (req,res) =>
{
    try{
        const {userId, officerRoleId} = req.body;

        if (!userId || !officerRoleId) {
            return res.status(400).json({message: "user and officerRoleId are required"});
        }

        const role = await officerRole.findById(officerRoleId);
        if (!role) {
            return res.status(404).json({message: "officer role not found"});
        }

        const user = await User.findByIdAndUpdate(
            userId,
            {role: "OFFICER", officerRoleId: officerRoleId},
            {new: true}
        ).select("-password");
        
        if (user) {
            await logAction(req.user._id, "ROLE_ASSIGENED", `Assigened role to ${user.name}`);
        }

        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json(user);
    }
    catch(error) {
        res.status(500).json({message: "server error", error: error.message});
    }
};

const getAllUsers = async (req,res) => {
    try{
        const users =await User.find().select("-password");
        res.status(200).json(users);
    }
    catch(error) {
        res.status(500).json({message: "server error", error: error.message});
    }
};

module.exports = {assignOfficerRole, getAllUsers};

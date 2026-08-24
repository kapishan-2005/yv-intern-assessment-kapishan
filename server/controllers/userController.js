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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search;
        const role = req.query.role;

        const filter = {};
        if (search) {
            filter.$or = [
                {name: {$regex: search, $options: "i"}},
                {email: {$regex: search, $options: "i"}},
            ];
        }
        if (role) {
            filter.role = role;
        }

        const users = await User.find(filter)
            .select("-password")
            .skip((page -1) * limit)
            .limit(limit)
            .sort({createdAt: -1});

        const total = await User.countDocuments(filter);

        res.status(200).json({
            data: users,
            total,
            page,
            totalPages: Math.ceil(total / limit),

        });

    }
    catch(error) {
        res.status(500).json({message: "server error", error: error.message});
    }
};

module.exports = {assignOfficerRole, getAllUsers};

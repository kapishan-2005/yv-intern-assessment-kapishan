const officerRole = require("../models/officerRole");

const createRole = async (req,res) => {
    try{
        const {name,description,permissions} = req.body;
        if (!name) {
            return res.status(400).json({message: "role name is required"});
        }
        const role = await officerRole.create({
            name,
            description,
            permissions,
        });

        res.status(201).json(role);
    }
    catch(error) {
        res.status(500).json({message: "server error", error: error.message});
    }
};

const getRoles = async (req,res) => {
    try{
        const roles = await officerRole.find();
        res.status(200).json(roles);
    }
    catch(error) {
        res.status(500).json({message: "server error", error: error.message});
    }
};

const updateRole = async (req,res) => {
    try{
        const {id} = req.params;
        const {name,description,permissions} = req.body;
        
        const role = await officerRole.findByIdAndUpdate(
            id,
            {name,description,permissions},
            {new: true}
        );
        if (!role) {
            return res.status(404).json({message: "Role not found"});
        }
        res.status(200).json(role);
    }
    catch(error) {
        res.status(500).json({message: "server error", error: error.message});
    }
};

module.exports = {createRole, getRoles, updateRole};
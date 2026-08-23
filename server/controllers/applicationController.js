const Application = require("../models/Application");

const submitApplication = async (req,res) => {
    try{
        const{ applicantType,fullName,companyName,nicOrRegNo,email,phone,address,membershipType,} = req.body;
         if (!applicantType || !nicOrRegNo || !email || !phone || !address || !membershipType){
                    return res.status(400).json({message: "please provide applicantType,nicOrRegNo,email,phone,address and membershipType"});
                }
              
        if (applicantType === "INDIVIDUAL" && !fullName) {
                    return res.status(400).json({message: "full name is required for indidual applicant"})
                }
        
        if (applicantType === "COMPANY" && !companyName) {
                    return res.status(400).json({message: "company name is required for company applicant"})
                }      
        const existingPending = await Application.findOne({userId: req.user._id,status: "PENDINg"});
        if (existingPending){
            return res.status(400).json({message: "you already have a pending application"});
        }
        const application = await Application.create({
            userId: req.user._id,
            applicantType,
            fullName,
            companyName,
            nicOrRegNo,
            email,
            phone,
            address,
            membershipType,
        });
        res.status(201).json(application);
    }
    catch (error){
        res.status(500).json({message: "server error", error: error.message});

    }
};

const getMyApplication = async (req,res) =>{
    try{
        const application = await Application.findOne({userId: req.user._id});
        if(!application){
            return res.status(404).json({message: "application not  found.please submit a application."});
        }
        res.status(200).json(application);
    }
    catch (error){
        res.status(500).json({message: "server error", error: error.message});
    }
};
module.exports = {submitApplication, getMyApplication};


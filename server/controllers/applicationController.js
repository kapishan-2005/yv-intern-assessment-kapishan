const Application = require("../models/Application");
const Member = require("../models/Member");
const generateMembershipNo = require("../utils/generateMembershipNo");
const logAction = require("../services/auditService");


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
        const existingPending = await Application.findOne({userId: req.user._id,status: "PENDING"});
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

const getAllApplications = async (req,res) => {
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;

        const filter ={};
        if (status) {
            filter.status = status;
        }

        const applications = await Application.find(filter)
            .populate("userId", "name email")
            .skip((page-1)* limit)
            .limit(limit)
            .sort({createdAt: -1});

        const total = await Application.countDocuments(filter);

        res.status(200).json({
            data: applications,
            total,
            page,
            totalPages: Math.ceil(total/ limit),
        });  
    }
     catch(error) {
        res.status(500).json({message: "server error", error: error.message});
    }
};

const approveApplication = async (req,res) => {
    try{
        const{id} = req.params;
        const application = await Application.findById(id);
        if (!application) {
            return res.status(404).json({message: "Application not found"});
        }
        if (application.status !=="PENDING") {
            return res.status(400).json({message: "only pending appliactions can be approved"});
        }

        application.status = "APPROVED";
        application.reviewedBy = req.user._id;
        await application.save();
        await logAction(req.user._id, "APPLICATION_APPROVED",`Approved application for ${application.fullName || application.companyName}`);
        const membershipNo = await generateMembershipNo();

        const member = await Member.create({
            userId: application.userId,
            applicationId: application._id,
            membershipNo,
        });

        res.status(200).json({application,member});
    }
     catch(error) {
        res.status(500).json({message: "server error", error: error.message});
    }
};


const rejectApplication = async (req,res) => {
    try{
        const {id} =req.params;
        const {rejectionReason} = req.body;

        if (!rejectionReason){
            return res.status(400).json({message: "Rejection reason is required"});
    }
    const application = await Application.findById(id);
    if (!application){
        return res.status(404).json({message: "Application not found"});
    }

    if (application.status !== "PENDING") {
        return res.status(400).json({message: "Only pending applications can be rejescted"});
    }

    application.status = "REJECTED";
    application.rejectionReason = rejectionReason;
    application.reviewedBy = req.user._id;
    await application.save();
    await logAction(req.user._id, "APPLICATION_REJECTED", `Rejected application for ${application.fullName || application.companyName}`);
    res.status(200).json(application)
}
 catch(error) {
        res.status(500).json({message: "server error", error: error.message});
    }
};

const getMyMembership = async (req,res) => {
    try{
        const member = await Member.findOne({userId:req.user._id});
        if (!member) {
            return res.ststus(404).json({message: "no active membership"});
        }
        res.ststus(200).json(member);
    }
    catch (error){
        res.ststus(500).json({message: "server error", error: error.message});
    }
};

module.exports = {submitApplication, getMyApplication, getAllApplications,approveApplication, rejectApplication,getMyMembership};


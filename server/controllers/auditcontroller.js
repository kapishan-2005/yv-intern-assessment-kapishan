const AuditLog = require("../models/AuditLog");

const getAuditLogs = async (req,res) => {
    try{
        const logs = await AuditLog.find()
          .populate("userId", "name email")
          .sort({createdAt: -1 });
        res.status(200).json(logs);
    }
    catch(error) {
        res.status(500).json({message: "server error", error: error.message});
    }
};

module.exports = {getAuditLogs};

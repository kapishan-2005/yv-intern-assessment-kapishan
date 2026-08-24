const AuditLog = require("../models/AuditLog");

const logAction = async(userId,action,details) => {
try{
    await AuditLog.create({userId, action , details});
}
catch(error){
    console.error("AuditLog error:", error.message);
}
};

module.exports =logAction;

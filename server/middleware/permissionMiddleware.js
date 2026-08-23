const OfficerRole = require("../models/officerRole");

const requirePermission = (permission) => {
    return async (req,res,next) =>{
        try{
            if (req.user.role === "CHAIRMAN"){
                return next();
            }
            if (req.user.role === "OFFICER"){
                const officerRole = await OfficerRole.findById(req.user.officerRoleId);
                if (officerRole && officerRole.permissions.includes(permission)){
                    return next();
                }
                return res.status(403).json({message: "insufficient permissions"});

            }
            return res.status(403).json({message: "insufficient permissions"});
        }
       catch (error) {
            return res.status(401).json({message: "Not authorized, token failed"});
    }
  };
};

module.exports = requirePermission;
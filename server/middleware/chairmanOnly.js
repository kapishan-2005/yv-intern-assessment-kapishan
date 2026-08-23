const chairmanOnly = (req,res,next) => {
    if (req.user.role !== "CHAIRMAN") {
        return res.status(403).json({message: "only chiarman can perform this action"});
    }
    next();
};

module.exports = chairmanOnly;
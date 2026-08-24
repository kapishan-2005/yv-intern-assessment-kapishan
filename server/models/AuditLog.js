const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        action: {
            type: String,
            required: true,
        },
        details: {
            ref: "user",
            type: String,
            default: "",
        },
     },
        {timestamps: true}
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
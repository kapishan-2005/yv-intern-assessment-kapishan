const MembershipType = require("../models/MembershipType");

const getMembershipTypes = async (req, res) => {
    try {
        const types = await MembershipType.find().sort({ name: 1 });
        res.status(200).json(types);
    } catch (error) {
        res.status(500).json({ message: "server error", error: error.message });
    }
};

module.exports = { getMembershipTypes };
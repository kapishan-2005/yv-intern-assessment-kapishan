const Counter = require("../models/Counter");

const generateMembershipNo = async () => {
    const year = new Date().getFullYear();

    const counter = await Counter.findOneAndUpdate(
        {year},
        {$inc:{lastNumber: 1}},
        {upsert:true, new: true}
    );

    const paddedNumber = String(counter.lastNumber).padStart(6, "0");
    return `YV-${year}-${paddedNumber}`;
};

module.exports = generateMembershipNo;
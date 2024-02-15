const mongoose = require("mongoose");

const interviewSchema = mongoose.Schema({
    Interviews_Details: {
        Company_Name: { type: String, required:true, default: '' },
        Date: { type: Date, required:true, default: '' },
        Results: { type: String, default: '' },
    },
});

module.exports = mongoose.model("interview", interviewSchema);

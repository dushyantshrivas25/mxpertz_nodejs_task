const mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
    Batch: {
        type: Number,
    },
    Student_Name: {
        type: String,
        required: true,
    },
    Student_Details: {
        College: { type: String, required: true, default: '' },
        Status: { type: String, required: true, default: 'Not Placed' },
    },
    Course_Score: {
        DSA_Final_Score: { type: Number, required: true, default: '' },
        WebD_final_Score: { type: Number, required: true, default: '' },
        React_Final_Score: { type: Number, required: true, default: '' },
    },
    Interviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Interview',
        },
    ],
});

module.exports = mongoose.model("student", studentSchema);

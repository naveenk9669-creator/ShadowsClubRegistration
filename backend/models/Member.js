const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    name: String,
    fatherName: String,
    age: String,
    dob: String,
    address: String,
    aadhaarNumber: String,
    mobile: String,
    email: String,
    memberId: {
    type: String,
    required: true,
    unique: true,
    },
    occupation: String,
    referrerName: String,
    referrerNumber: String,
    photo: String,
    aadhaarFile: String,
    status: String,
    createDT:Date,
    updateDT:Date,
    isDeleted: Boolean,
  },
  { timestamps: true }
);
module.exports = mongoose.model("Member", memberSchema);
const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  name: String,
  sequence: Number,
});

module.exports = mongoose.model("Counter", counterSchema);
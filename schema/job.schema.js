const mongoose = require("mongoose"); //importing mongoose
const Schema = mongoose.Schema; //importing schema
const { User } = require("./user.schema"); //importing user schema from user.schema
const jobSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  jobType: {
    type: String,
    required: true,
    enum: ["full-time", "part-time", "remote", "internship", "contract"], //job type can only be full-time, part-time, remote, internships, Contract -- Selected Options
  },
  remote: {
    type: Boolean,
    required: true,
    default: false,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  skills: {
    type: [Array],
    required: true,
  },
  information: {
    type: String,
    required: true,
  },
  creator: {
    type: mongoose.Schema.ObjectId, //using mongoose.Schema.ObjectId to create a reference to the user schema
    ref: "User", //referencing user schema
    required: true,
  },
});

const Job = mongoose.model("job", jobSchema);
module.exports = { Job };

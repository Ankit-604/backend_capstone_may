const express = require("express");
const router = express.Router();
const { Job } = require("../schema/job.schema");
const authMiddleware = require("../middleware/auth");
const isAuth = require("../utils/index");
const { z } = require("zod"); //zod is a library for validation
const { validateRequest } = require("zod-express-middleware"); //zod-express-middleware is a library that integrates zod with express middleware

//Create job
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      logo,
      position,
      salary,
      jobType,
      remote,
      location,
      skills,
      description,
      about,
      information,
    } = req.body;
    const { user } = req;
    const jobs = skills.split(",").map((skill) => skill.trim());
    const job = new Job({
      name,
      logo,
      position,
      salary,
      jobType,
      remote,
      location,
      skills,
      description,
      about,
      information,
      creator: user,
    });
    await job.save();
    res.status(201).json({
      msg: "Job created successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "Job is not created" });
  }
});

//Get job
router.get("/", async (req, res) => {
  try {
    const isAuthenticated = isAuth(req);
    const jobs = isAuthenticated
      ? await Job.find()
      : await Job.find().select("-_id -creator -about -information"); //if user is not authenticated, only retrieves the job name, logo, position, salary, jobType, remote, location, skills, description, about, information
    res.status(200).json({
      msg: "Jobs retrieved successfully",
      jobs,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "Jobs could not be retrieved" });
  }
});

//Get job by id
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    } //checking if job exists
    res.status(200).json({ msg: "Job retrieved successfully", job });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "Job could not be retrieved" });
  }
});

//Validate job schema
// router.get(
//   "/:id",
//   validateRequest({
//     params: z.object({
//       id: z.string().uuid(), //validating id
//     }),
//   }),
//   authMiddleware,
//   async (req, res) => {
//     const { id } = req.params;
//     const job = await Job.findById(id);
//     if (!job) {
//       return res.status(404).json({ msg: "Job not found" });
//     } //checking if job exists
//     res.status(200).json({ msg: "Job retrieved successfully", job });
//   }
// );

//Delete job
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    } //checking if job exists
    if (job.creator.toString() !== req.user.toString()) {
      return res
        .status(401)
        .json({ msg: "You are not authorized to delete this job" });
    } //checking if user is the creator of the job
    //toString() is used to convert the ObjectId to a string
    await Job.findByIdAndDelete(id); //deleting job using findByIdAndDelete which takes in the id of the job and deletes it
    res.status(200).json({ msg: "Job deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "Job could not be deleted" });
  }
});

//Update job
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      logo,
      position,
      salary,
      jobType,
      remote,
      location,
      skills,
      description,
      about,
      information,
    } = req.body; //
    const jobskills = skills?.split(",").map((skill) => skill.trim()); //splitting skills string into an array and removing any whitespace. This is done to make sure that the skills are not split into multiple skills
    let job = await Job.findById(id); //finding job by id
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }
    if (job.creator.toString() !== req.user.toString()) {
      return res
        .status(401)
        .json({ msg: "You are not authorized to update this job" });
    } //checking if user is the creator of the job
    job = await Job.findByIdAndUpdate(
      id,
      {
        name,
        logo,
        position,
        salary,
        jobType,
        remote,
        location,
        skills: jobskills,
        description,
        about,
        information,
      },
      { new: true }
    ); //updating job using findByIdAndUpdate which takes in the id of the job, the updated job data, and options to update the job
    //new: true is used to return the updated job
    res.status(200).json({
      msg: "Job updated successfully",
      job,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "Job could not be updated" });
  }
});

//Search jobs by title
router.get("/search/:title", async (req, res) => {
  try {
    const { title } = req.params;
    const jobs = await Job.find({ name: new RegExp(title, "i") }).select(
      "-_id -creator -about -information"
    ); //selecting the fields to be returned
    //RegExp is used to search for jobs with the title in the name field.
    res.status(200).json({ msg: "Jobs retrieved successfully", jobs });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "Jobs could not be retrieved" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const { User } = require("../schema/user.schema");
const { checkSchema, check, schema } = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();
const { query } = require("express-validator");
const e = require("express");

// Register User
router.post("/register", async (req, res) => {
  const { name, email, password, mobile } = req.body;
  console.log(req.body);
  // check(["body"]);
  // const result = await checkSchema({
  //   email: { isEmail: true, errorMessage: "Please enter a valid email" },
  //   password: {
  //     isLength: { options: { min: 8 } },
  //     errorMessage: "Password must be at least 8 characters",
  //   },
  // }).run(req);

  // const emailResult = await check("email").isEmail().run(req.body);
  // const passwordResult = await check("password")
  //   .isLength({ min: 8 })
  //   .run(req.body);
  // console.log(emailResult, passwordResult);
  // return;

  const ifUserExist = await User.findOne({ email }); //check if user exist

  if (ifUserExist) {
    return res.status(400).json({ msg: "User already exist" });
  }
  const hashedPassword = await bcrypt.hash(password, 10); //hashing the password
  const user = new User({
    name,
    email,
    password: hashedPassword,
    mobile,
  }); //creating new user
  await user.save(); //saving the user
  res.status(201).json({ msg: "User created successfully" }); //sending response to client
});

//To get all users
router.get("/", async (req, res) => {
  const users = await User.find().select("-password -_id");
  res.status(200).send(users);
});

//To get a single user
router.get("/:email", async (req, res) => {
  const { email } = req.params;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send({ msg: "User not found" });
  }
  res.status(200).send(user);
});

//Login a user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ msg: "Wrong email or password" });
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password); //comparing password between client and database
  if (!isPasswordMatch) {
    return res.status(400).json({ msg: "Wrong email or password" });
  }
  const payload = {
    id: user._id,
  };
  const token = jsonwebtoken.sign(payload, process.env.JWT_SECRET); //generating token for user --> sending token to client/frontend --> sending token to backend for verification
  res.status(200).json({ token });
});

//To update a user
router.patch("/:id", async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, password },
    { new: true }
  );
  if (!user) {
    return res.status(404).send("User not found");
  }
  res.status(200).send(user);
});
module.exports = router;

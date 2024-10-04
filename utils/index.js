//Auth middleware checks if user is logged in or not and returns true or false

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const isAuth = (req) => {
  const token = req.headers.authorization; //getting token
  if (!token) {
    return false;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); //verifying token
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = isAuth;

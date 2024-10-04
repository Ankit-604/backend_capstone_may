//Auth middleware checks if user is logged in or not

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization; //getting token
  if (!token) {
    return res.status(401).json({ msg: "User not logged in" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); //verifying token
    req.user = decoded.id; //assigning user id to req.user
    next();
  } catch (err) {
    res.status(401).json({ msg: "User not logged in" });
  }
};

module.exports = authMiddleware;

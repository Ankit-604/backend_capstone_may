const express = require("express");
const router = express.Router();

//get route
router.get("/ping", (req, res) => {
  res.send("Hello from recruity");
});

module.exports = router;
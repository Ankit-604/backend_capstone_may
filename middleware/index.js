const fs = require("fs");

//middleware
const incomingRequestLogger = (req, res, next) => {
  var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  //logging the request
  fs.appendFileSync(
    "./logs.txt",
    `${req.method} ${req.url} ${ip} ${new Date().toISOString()}\n`
  );
  next();
};

module.exports = {
  incomingRequestLogger,
};

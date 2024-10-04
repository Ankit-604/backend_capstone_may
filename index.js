const express = require("express"); //importing express
const dotenv = require("dotenv"); //to read .env file
const app = express(); //initializing express
const fs = require("fs"); //for file system
const cors = require("cors"); //for cors
const bodyParser = require("body-parser");
const { incomingRequestLogger } = require("./middleware/index.js");
const indexRouter = require("./routes/index.js");
const mongoose = require("mongoose");
const { error } = require("console");
const userRouter = require("./routes/user");
const jobRouter = require("./routes/job");
dotenv.config();

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//middleware
app.use(incomingRequestLogger);

//routes
app.use("/api/v1", indexRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", require("./middleware/auth.js"));
app.use("/api/v1/job", jobRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
  mongoose.connect(process.env.MONGOOSE_URI_STRING, {}); //connecting to mongodb
  mongoose.connection.once("error", (err) => {
    console.log(err);
  });
});

const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const apiRouter = require("./api");

const app = express();
mongoose.Promise = global.Promise;

mongoose
  .connect(`mongodb://localhost:27017/carStore2`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  })
  .then((mongoose) => {
    console.log("connected to mongo");
  })
  .catch(console.error);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", cors(), apiRouter);

// error handler
app.use(function (err, req, res, next) {
  if (err.name === "ValidationError") {
    res.status(400);
  } else {
    // use the error's status or default to 500
    res.status(err.status || 500);
  }

  console.error(err);

  // send back json data
  res.send({
    message: err.message,
  });
});

app.listen(3333, () => {
  console.log(`Server started on http://localhost:3333`);
});

module.exports = app;

const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

const app = express();
const { MONGODB_URI } = process.env;

const userRoutes = require("./routes/users-routes");
const HttpError = require("./model/http-error");

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(bodyParser.json());

// we are prefixing userRoutes with /api/users
app.use("/api/users", userRoutes);

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(5000, () => console.log("Listening on port 5000"));
  })
  .catch((err) => {
    console.log(err);
  });

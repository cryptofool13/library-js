import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import * as bookController from "./controllers/book";
import { MONGO_URI } from "./util/secret";

// load environment variables
import dotenv from "dotenv";
dotenv.config();

// create express server
const app = express();

// connect to database
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {})
  .catch(err => {
    console.log("failed to connect to db");
  });

// express configuration
app.set("port", process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.get("/", (req, res) => {
  res.send("ayo");
});
app.post("/library", bookController.addBook);
app.delete("/library/:id", bookController.removeBook);
export { app };

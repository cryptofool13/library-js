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
app.get("/library", bookController.getAllBooks);
app.post("/library", bookController.addBook);
app.delete("/library/:id", bookController.removeBook);
app.post("/library/:id", bookController.updateBook);

export { app };

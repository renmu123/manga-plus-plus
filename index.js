import express from "express";
import "express-async-errors";

import cors from "cors";
import morgan from "morgan";
import fileUpload from "express-fileupload";
import winston from "winston";
import expressWinston from "express-winston";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import comicRouter from "./src/routes/comic.js";
import authorRouter from "./src/routes/author.js";
import chapterRouter from "./src/routes/chapter.js";
import tagRouter from "./src/routes/tag.js";
import libraryRouter from "./src/routes/library.js";
import commonRouter from "./src/routes/common.js";
import configRouter from "./src/routes/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hostname = "localhost";
const port = 3000;

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

const app = express();
app.use(cors({ exposedHeaders: ["Content-Disposition"] }));
app.use(express.json());
app.use(morgan("combined", { stream: accessLogStream }));
app.use(fileUpload());

app.use("/comic", comicRouter);
app.use("/author", authorRouter);
app.use("/chapter", chapterRouter);
app.use("/tag", tagRouter);
app.use("/library", libraryRouter);
app.use("/common", commonRouter);
app.use("/config", configRouter);

app.use(
  expressWinston.errorLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: "log.log", level: "debug" }),
    ],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
  })
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Error handling Middleware function for logging the error message
const errorLogger = (error, request, response, next) => {
  console.log(`error ${error.message}`);
  next(error); // calling next middleware
};

const errorHandler = (error, request, response, next) => {
  // Error handling middleware functionality
  const status = error.status || 400;
  // send back an easily understandable error message to the caller
  response.status(status).json({ errors: [{ msg: error.message }] });
};

// Fallback Middleware function for returning
// 404 error for undefined paths
const invalidPathHandler = (request, response, next) => {
  response.status(404);
  response.send("invalid path");
};

app.use(errorLogger);
app.use(errorHandler);
app.use(invalidPathHandler);

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

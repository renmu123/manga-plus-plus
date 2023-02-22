import express from "express";
import "express-async-errors";

import cors from "cors";
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

const hostname = "0.0.0.0";
const port = 3000;

const app = express();
app.use(cors({ exposedHeaders: ["Content-Disposition"] }));
app.use(express.json());
app.use(fileUpload());

app.use("/api/comic", comicRouter);
app.use("/api/author", authorRouter);
app.use("/api/chapter", chapterRouter);
app.use("/api/tag", tagRouter);
app.use("/api/library", libraryRouter);
app.use("/api/common", commonRouter);
app.use("/api/config", configRouter);

app.use(
  expressWinston.errorLogger({
    transports: [
      // new winston.transports.Console(),
      new winston.transports.File({
        filename: "info.log",
        level: "info",
        maxsize: 5242880,
      }),
    ],
    format: winston.format.combine(
      // winston.format.colorize(),
      winston.format.printf((data) => {
        return `[${data.meta.level}][${data.meta.date}]: ${
          data.meta.message
        }\n${JSON.stringify(data)}`;
      })
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

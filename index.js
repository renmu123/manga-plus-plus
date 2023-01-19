import express from "express";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import comicRouter from "./routers/comic.js";
import authorRouter from "./routers/author.js";
import chapterRouter from "./routers/chapter.js";
import tagRouter from "./routers/tag.js";
import libraryRouter from "./routers/library.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hostname = "localhost";
const port = 3000;

const errorHandler = (error, request, response, next) => {
  // Error handling middleware functionality
  console.log(`error ${error.message}`); // log the error
  const status = error.status || 400;
  // send back an easily understandable error message to the caller
  response.status(status).send(error.message);
};

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("combined", { stream: accessLogStream }));

app.use("/comic", comicRouter);
app.use("/author", authorRouter);
app.use("/chapter", chapterRouter);
app.use("/tag", tagRouter);
app.use("/library", libraryRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

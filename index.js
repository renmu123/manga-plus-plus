import express from "express";
import cors from "cors";
import comicRouter from "./routers/comic.js";
import authorRouter from "./routers/author.js";
import chapterRouter from "./routers/chapter.js";
import tagRouter from "./routers/tag.js";

const hostname = "localhost";
const port = 3000;

const jsonErrorHandler = (err, req, res, next) => {
  res.status(500).send({ error: err });
};

const app = express();
app.use(cors());
app.use(express.json());
app.use(jsonErrorHandler);

app.use("/comic", comicRouter);
app.use("/author", authorRouter);
app.use("/chapter", chapterRouter);
app.use("/tag", tagRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

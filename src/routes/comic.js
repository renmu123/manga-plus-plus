import express from "express";
import "express-async-errors";

import validator from "express-validator";
import validate from "../utils/valid.js";
import prisma from "../utils/db.js";
import comic from "../services/comic.js";

const { body, param, query } = validator;
const router = express.Router();

// 添加路由
router.post("/add", validate([body("name").isString()]), async (req, res) => {
  const status = req.body.status || 2;
  const readingStatus = req.body.readingStatus || 1;

  if (![1, 2].includes(status)) {
    throw new Error("status状态值仅限1，2");
  }
  if (![1, 2, 3].includes(readingStatus)) {
    throw new Error("status状态值仅限1，2，3");
  }

  const data = req.body;
  delete data.dir;
  data.status = status;
  data.readingStatus = readingStatus;

  const post = await comic.addComic(data);

  res.json(post);
});

router.post(
  "/remove",
  validate([body("id").isInt().toInt()]),
  async (req, res) => {
    const { id } = req.body;

    await prisma.$transaction([
      prisma.comic.delete({
        where: { id },
      }),
    ]);
    // TODO:delete local files
    res.json({ success: true });
  }
);

router.post(
  "/edit",
  validate([body("id").isInt().toInt()]),
  async (req, res) => {
    const status = req.body.status;
    const readingStatus = req.body.readingStatus;
    const { id } = req.body;

    if (status && ![1, 2].includes(status)) {
      throw new Error("status状态值仅限1，2");
    }
    if (readingStatus && ![1, 2, 3].includes(readingStatus)) {
      throw new Error("status状态值仅限1，2，3");
    }

    const data = req.body;
    data.status = status;
    data.readingStatus = readingStatus;

    // TODO:编辑comic名称时，源文件名称也会修改
    const post = await comic.updateComic(id, req.body);

    res.json(post);
  }
);

router.get(
  "/list",
  validate([query("libraryId").isInt().toInt()]),
  async (req, res) => {
    const posts = await comic.getComics(req.query.libraryId);
    res.json(posts);
  }
);

router.get(
  "/query/:id",
  validate([param("id").isInt().toInt()]),
  async (req, res) => {
    const post = await comic.getComic(req.params.id);
    res.json(post);
  }
);

router.get(
  "/query/:id/upsertHistory",
  validate([
    param("id").isInt().toInt(),
    query("chapterId").isInt().toInt(),
    query("page").isInt().toInt(),
  ]),
  async (req, res) => {
    const data = {
      comicId: req.params.id,
      chapterId: req.query.chapterId,
      page: req.query.page,
    };
    const post = await prisma.history.upsert({
      where: { comicId: req.params.id, chapterId: req.query.chapterId },
      update: data,
      create: datar,
    });

    res.json({ post });
  }
);

export default router;

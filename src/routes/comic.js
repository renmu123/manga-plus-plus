import express from "express";
import "express-async-errors";

import validator from "express-validator";
import validate from "../utils/valid.js";
import prisma from "../utils/db.js";
import { getCover } from "../utils/index.js";

import comic from "../services/comic.js";

const { body, param, query } = validator;
const router = express.Router();

// 添加漫画
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
    const post = prisma.comic.getComic(id);

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

    const data = {
      id: req.body.id,
      cover: req.body.cover,
      inReadList: req.body.inReadList,
      name: req.body.name,
      publish: req.body.publish,
      publishTime: req.body.publishTime,
      readingStatus: req.body.readingStatus,
      summary: req.body.summary,
      tags: req.body.tags,
      authors: req.body.authors,
    };

    const post = await comic.updateComic(id, data);

    res.json(post);
  }
);

router.get(
  "/list",
  validate([
    query("libraryId").isInt().toInt(),
    query("idCursor").default(0).isInt().toInt(),
    query("size").default(50).isInt().toInt(),
    query("tags").default("").isString(),
    query("authors").default("").isString(),
  ]),
  async (req, res) => {
    const filter = {
      tags: req.query.tags
        .split(",")
        .filter((val) => val)
        .map(Number),
      authors: req.query.authors
        .split(",")
        .filter((val) => val)
        .map(Number),
    };
    let posts = await comic.getComics(
      req.query.libraryId,
      {},
      {
        size: req.query.size,
        idCursor: req.query.idCursor,
      },
      filter
    );

    posts = posts.map((item) => {
      if (item.cover) {
        item.cover = getCover(item.cover);
      }
      return item;
    });
    res.json(posts);
  }
);

router.get(
  "/query/:id",
  validate([
    param("id").isInt().toInt(),
    query("includeChapters").default(false).toBoolean(),
    query("includeTags").default(true).toBoolean(),
    query("includeAuthors").default(true).toBoolean(),
  ]),
  async (req, res) => {
    const post = await comic.getComic(req.params.id, {
      chapters: req.query.includeChapters,
      tags: req.query.includeTags,
      authors: req.query.includeAuthors,
    });
    if (post.cover) {
      post.cover = getCover(post.cover);
    }
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
      create: data,
    });

    res.json({ post });
  }
);

export default router;

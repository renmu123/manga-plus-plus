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
  const { name } = req.body;

  const data = {
    name,
  };
  const post = await comic.addComic(data);

  res.json(post);
});

router.post(
  "/remove",
  validate([body("id").isInt().toInt()]),
  async (req, res) => {
    const { id } = req.body;

    await prisma.$transaction([
      // prisma.chapter.deleteMany({
      //   where: {
      //     comicId: id,
      //   },
      // }),
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
    const { id } = req.body;
    const post = await comic.updateComic(id, req.body);

    res.json(post);
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
  "/list",
  validate([query("libraryId").isInt().toInt()]),
  async (req, res) => {
    const posts = await comic.getComics(req.query.libraryId);
    res.json(posts);
  }
);

export default router;

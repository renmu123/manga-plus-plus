import express from "express";
import "express-async-errors";

import validator from "express-validator";
import validate from "../utils/valid.js";
import prisma from "../utils/db.js";
import chapter from "../services/chapter.js";

const { body, param, query } = validator;
const router = express.Router();

// 添加路由
router.post("/add", validate([body("name").isString()]), async (req, res) => {
  const post = await chapter.addChapter(req.body);
  res.json(post);
});

router.post(
  "/remove",
  validate([body("id").isInt().toInt()]),
  async (req, res) => {
    const { id } = req.body;
    const post = await chapter.removeChapter(id);
    res.json(post);
  }
);

router.post(
  "/edit",
  validate([body("id").isInt().toInt()]),
  async (req, res) => {
    const { id } = req.body;

    const post = await chapter.updateChapter(id, req.body);
    res.json(post);
  }
);

router.get(
  "/query/:id",
  validate([param("id").isInt().toInt()]),
  async (req, res) => {
    const post = await chapter.getChapter(req.params.id);
    res.json(post);
  }
);

router.get(
  "/list",
  validate([query("comicId").isInt().toInt()]),
  async (req, res) => {
    const post = await chapter.getChapters(req.query.comicId);
    res.json(post);
  }
);

export default router;

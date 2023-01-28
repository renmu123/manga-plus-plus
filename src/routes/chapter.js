import express from "express";
import "express-async-errors";
import fs from "fs-extra";

import validator from "express-validator";
import validate from "../utils/valid.js";
import { filterImgFile } from "../utils/index.js";
import chapter from "../services/chapter.js";

const { body, param, query } = validator;
const router = express.Router();

// 添加路由
router.post("/add", validate([body("name").isString()]), async (req, res) => {
  const data = req.body;
  delete data.type;
  const post = await chapter.addChapter(data);
  res.json(post);
});

router.post(
  "/remove",
  validate([body("id").isInt().toInt()]),
  async (req, res) => {
    const { id } = req.body;
    // TODO:delete local files
    const post = await chapter.removeChapter(id);
    res.json(post);
  }
);

router.post(
  "/edit",
  validate([body("id").isInt().toInt()]),
  async (req, res) => {
    const { id } = req.body;
    const data = req.body;
    delete data.type;

    const post = await chapter.updateChapter(id, req.body);
    // TODO:更新chapter名称时，源文件名称也会修改

    res.json(post);
  }
);

router.get(
  "/query/:id",
  validate([param("id").isInt().toInt()]),
  async (req, res) => {
    const post = await chapter.getChapter(req.params.id);
    if (!(await fs.pathExists(post.dir))) {
      throw new Error("该路径下不存在章节");
    }
    const names = await fs.readdir(post.dir);
    const imageFiles = await filterImgFile(names);
    res.json({ ...post, total: imageFiles.length });
  }
);

router.get(
  "/query/:id/image",
  validate([
    param("id").isInt().toInt(),
    param("page").isInt().toInt(),
    param("offset").isInt().toInt(),
  ]),
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

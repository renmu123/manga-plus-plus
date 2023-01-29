import express from "express";
import "express-async-errors";
import fs from "fs-extra";
import path from "path";

import validator from "express-validator";
import validate from "../utils/valid.js";
import {
  readImageFromDir,
  readImageFromAcrchive,
  getContentType,
} from "../utils/index.js";
import chapter from "../services/chapter.js";

const { body, param, query } = validator;
const router = express.Router();

// 添加路由
router.post("/add", validate([body("name").isString()]), async (req, res) => {
  const data = req.body;
  data.type = "file";
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
    let imageFiles = [];
    if (post.type === "folder") {
      imageFiles = await readImageFromDir(post.dir);
    } else if (post.type === "file") {
      imageFiles = readImageFromAcrchive(post.dir);
    }

    res.json({
      ...post,
      totalImage: imageFiles.length,
    });
  }
);

router.get(
  "/query/:id/images",
  validate([
    param("id").isInt().toInt(),
    query("page").isInt().toInt(),
    query("offset").isInt().toInt(),
  ]),
  async (req, res) => {
    const page = req.query.page;

    const post = await chapter.getChapter(req.params.id);
    let imageFiles = [];

    if (post.type === "folder") {
      imageFiles = await readImageFromDir(post.dir);
    } else if (post.type === "file") {
      imageFiles = readImageFromAcrchive(post.dir).map((item) => item.name);
    }
    const data = imageFiles.slice(page, page + req.query.offset);
    res.json({
      data: data,
      pagination: {
        total: imageFiles.length,
        // page: page,
      },
    });
  }
);

router.get(
  "/query/:id/image/:imageName",
  validate([param("id").isInt().toInt(), param("imageName").isString()]),
  async (req, res) => {
    const imageName = req.params.imageName;
    const post = await chapter.getChapter(req.params.id);

    if (post.type === "folder") {
      const imagePath = path.join(post.dir, imageName);
      res.sendFile(imagePath);
    } else if (post.type === "file") {
      const imageFiles = readImageFromAcrchive(post.dir);
      for (const imageFile of imageFiles) {
        if (imageFile.name === imageName) {
          const contentType = getContentType(imageName);
          res.type(contentType);

          res.send(imageFile.getData());
        }
      }
    }
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

import express from "express";
import "express-async-errors";

import validator from "express-validator";
import validate from "../utils/valid.js";
import prisma from "../utils/db.js";
import { writeCoverToMetadata } from "../utils/index.js";

import path from "path";
import fs from "fs/promises";
import appRoot from "app-root-path";

const { body, param, query } = validator;
const router = express.Router();

router.get(
  "/filesystem",
  validate([query("path").isString(), query("include")]),
  async (req, res) => {
    const root = req.query.path;
    const paths = await fs.readdir(root);
    let parentDir = path.dirname(root);

    const data = [];
    for (const name of paths) {
      const filePath = path.join(root, name);
      try {
        const fileStat = await fs.stat(filePath);
        if (req.query.include === "directory" && fileStat.isDirectory()) {
          data.push({
            type: "directory",
            name: name,
            path: filePath,
          });
        } else if (req.query.include === "file" && fileStat.isFile()) {
          data.push({
            type: "file",
            name: name,
            path: filePath,
          });
        }
      } catch (error) {
        continue;
      }
    }
    res.json({ list: data, parent: parentDir });
  }
);

// upload cover
router.post("/cover/upload", async (req, res) => {
  if (!(req.files && req.files.file)) {
    throw new Error("请选择文件");
  }
  const { ext } = path.parse(req.files.file.name);
  const filePath = await writeCoverToMetadata(req.files.file.data, ext);

  res.json({ path: filePath });
});

// cover image
router.get(
  "/cover/:name",
  validate([param("name").isString()]),
  async (req, res) => {
    const imagePath = path.join(
      appRoot.path,
      "metadata",
      "cover",
      req.params.name
    );
    res.sendFile(imagePath);
  }
);

export default router;

import express from "express";
import "express-async-errors";

import validator from "express-validator";
import validate from "../utils/valid.js";
import prisma from "../utils/db.js";

import path from "path";
import fs from "fs/promises";

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

export default router;

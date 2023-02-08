import express from "express";
import "express-async-errors";

import validator from "express-validator";
import validate from "../utils/valid.js";
import prisma from "../utils/db.js";
import { getCover } from "../utils/index.js";

import library from "../services/library.js";

const { body, param, query } = validator;
const router = express.Router();

router.post(
  "/add",
  validate([
    body("name").isString(),
    body("dir").isString(),
    body("config").isObject(),
  ]),
  async (req, res) => {
    let data = req.body;

    if (!existsSync(data.dir)) {
      throw new Error("路径不存在");
    }
    const librarys = await library.getLibrarys({ dir: data.dir });
    if (librarys.length !== 0) {
      throw new Error("该路径下已存在库");
    }
    const post = await library.addLibrary(data);

    // scan the library after add library
    await library.scanLibrary(post.id);
    res.json(post);
  }
);

router.post(
  "/remove",
  validate([body("id").isInt().toInt()]),
  async (req, res) => {
    const { id } = req.body;

    await prisma.$transaction([
      prisma.library.delete({
        where: { id },
      }),
    ]);
    res.json({ success: true });
  }
);

router.post(
  "/edit",
  validate([body("id").isInt().toInt()]),
  async (req, res) => {
    const { id } = req.body;
    const data = req.body;
    // library dir can not be edit
    delete data.dir;
    if (data.config) {
      delete data.config.libraryId;
    }

    const post = await library.editLibrary(id, data);
    res.json(post);
  }
);

router.get(
  "/query/:id",
  validate([
    param("id").isInt().toInt(),
    query("includeComics").default(false).isBoolean(),
    query("includeConfig").default(false).isBoolean(),
  ]),
  async (req, res) => {
    const post = await library.getLibrary(req.params.id, {
      comics: req.query.includeComics,
      config: req.query.includeConfig,
    });
    if (post.cover) {
      post.cover = getCover(post.cover);
    }

    res.json(post);
  }
);

router.get(
  "/list",
  validate([query("queryConfig").optional()]),
  async (req, res) => {
    const queryConfig = req.query.queryConfig == "1" ? true : false;
    const queryData = {
      name: req.query.name,
    };
    let librarys = await library.getLibrarys(queryData, queryConfig);
    librarys = librarys.map((item) => {
      if (item.cover) {
        item.cover = getCover(item.cover);
      }
      return item;
    });
    res.json(librarys);
  }
);

router.get(
  "/scan",
  validate([query("id").isInt().toInt()]),
  async (req, res) => {
    const { id } = req.query;

    await library.scanLibrary(id);

    res.json({ success: true });
  }
);

router.get(
  "/scanCover",
  validate([query("id").isInt().toInt()]),
  async (req, res) => {
    const { id } = req.query;

    await library.scanCover(id);

    res.json({ success: true });
  }
);
export default router;

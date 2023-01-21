import express from "express";
import "express-async-errors";

import validator from "express-validator";
import validate from "../utils/valid.js";
import prisma from "../utils/db.js";
import library from "../services/library.js";

const { body, param, query } = validator;
const router = express.Router();

router.post(
  "/add",
  validate([body("name").isString(), body("dir").isString()]),
  async (req, res) => {
    const post = await library.addLibrary(req.body);

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
      prisma.comic.deleteMany({
        where: {
          libraryId: id,
        },
      }),
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

    const post = library.editLibrary(id, data);
    res.json(post);
  }
);

router.get(
  "/:id",
  validate([param("id").isInt().toInt()]),
  async (req, res) => {
    const post = await library.getLibrary(req.params.id);

    res.json(post);
  }
);

router.get("/list", async (req, res) => {
  const librarys = await library.getLibrarys();
  res.json(librarys);
});

router.get(
  "/scan",
  validate([query("libraryId").isInt().toInt()]),
  async (req, res) => {
    const { libraryId } = req.query;

    await library.scanLibrary(libraryId);

    res.json({ success: true });
  }
);

router.get(
  "/scanCover",
  validate([query("libraryId").isInt().toInt()]),
  async (req, res) => {
    const { libraryId } = req.query;

    await library.scanCover(libraryId);

    res.json({ success: true });
  }
);
export default router;

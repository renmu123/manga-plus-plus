import express from "express";
import "express-async-errors";

import validator from "express-validator";
import validate from "../utils/valid.js";
import prisma from "../utils/db.js";

const { body, param } = validator;
const router = express.Router();

router.post(
  "/add",
  validate([body("name").isString(), body("dir").isString()]),
  async (req, res) => {
    const post = await prisma.library.create({
      data: req.body,
    });
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
    const post = await prisma.library.update({
      where: { id },
      data: req.body,
    });
    res.json(post);
  }
);

router.get(
  "/query/:id",
  validate([param("id").isInt().toInt()]),
  async (req, res) => {
    const post = await prisma.library.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        comics: true,
      },
    });
    res.json(post);
  }
);

router.get("/query", async (req, res) => {
  const post = await prisma.library.findMany({});
  res.json(post);
});

export default router;

import express from "express";
import "express-async-errors";

import validator from "express-validator";
import validate from "../utils/valid.js";
import prisma from "../utils/db.js";

const { body, param } = validator;
const router = express.Router();

router.post("/add", validate([body("name").isString()]), async (req, res) => {
  const post = await prisma.tag.create({
    data: req.body,
  });
  res.json(post);
});

router.post(
  "/remove",
  validate([body("id").isInt().toInt()]),
  async (req, res) => {
    const { id } = req.body;
    const post = await prisma.tag.delete({
      where: { id },
    });
    res.json(post);
  }
);

router.post(
  "/edit",
  validate([body("id").isInt().toInt()]),
  async (req, res) => {
    const { id } = req.body;
    const post = await prisma.tag.update({
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
    const post = await prisma.tag.findUnique({
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
  const post = await prisma.tag.findMany({});
  res.json(post);
});

export default router;

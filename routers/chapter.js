import express from "express";
import validator from "express-validator";
import validate from "../utils/valid.js";
import prisma from "../utils/db.js";

const { body, param } = validator;
const router = express.Router();

// 添加路由
router.post("/add", validate([body("name").isString()]), async (req, res) => {
  const post = await prisma.chapter.create({
    data: req.body,
  });
  res.json(post);
});

router.post(
  "/remove",
  validate([body("id").isInt().toInt()]),
  async (req, res) => {
    const { id } = req.body;
    const post = await prisma.chapter.delete({
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
    const post = await prisma.chapter.update({
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
    const post = await prisma.chapter.findUnique({
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
  const post = await prisma.chapter.findMany({});
  res.json(post);
});

export default router;

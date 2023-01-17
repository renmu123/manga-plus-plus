import express from "express";

const router = express.Router();

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 添加路由
router.post("/add", async (req, res) => {
  const { name } = req.body;
  const post = await prisma.chapter.create({
    data: {
      name,
    },
  });
  res.json(post);
});

router.post("/remove", async (req, res) => {
  const { id } = req.body;
  const post = await prisma.chapter.delete({
    where: { id },
  });
  res.json(post);
});

router.post("/edit", async (req, res) => {
  const { id, name } = req.body;
  const post = await prisma.chapter.update({
    where: { id },
    data: {
      name,
    },
  });
  res.json(post);
});

router.get("/query", async (req, res) => {
  const { id } = req.query;

  if (id) {
    const post = await prisma.chapter.findUnique({
      where: {
        id: Number(id),
      },
    });
    res.json(post);
  } else {
    const post = await prisma.chapter.findMany({});
    res.json(post);
  }
});

export default router;

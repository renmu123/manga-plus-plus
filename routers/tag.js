import express from "express";
const router = express.Router();

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

router.post("/add", async (req, res) => {
  const { name } = req.body;
  const post = await prisma.tag.create({
    data: {
      name,
    },
  });
  res.json(post);
});

router.post("/remove", async (req, res) => {
  const { id } = req.body;
  const post = await prisma.tag.delete({
    where: { id },
  });
  res.json(post);
});

router.post("/edit", async (req, res) => {
  const { id, name } = req.body;
  const post = await prisma.tag.update({
    where: { id },
    data: {
      name,
    },
  });
  res.json(post);
});

router.get("/query/:id", async (req, res) => {
  const post = await prisma.tag.findUnique({
    where: {
      id: Number(req.params.id),
    },
    include: {
      comics: true,
    },
  });
  res.json(post);
});

router.get("/query", async (req, res) => {
  const post = await prisma.tag.findMany({});
  res.json(post);
});

export default router;

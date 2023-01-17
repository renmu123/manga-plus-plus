import express from "express";
import fs from "fs/promises";
import path from "path";

const router = express.Router();

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 添加路由
router.post("/add", async (req, res) => {
  const { name, tags } = req.body;
  const data = {
    name,
  };
  if (tags) {
    data["tags"] = {
      connect: tags.map((tagId) => {
        return { id: tagId };
      }),
    };
  }

  const post = await prisma.comic.create({
    data: data,
  });
  res.json(post);
});

router.post("/remove", async (req, res) => {
  const { id } = req.body;

  await prisma.$transaction([
    prisma.chapter.deleteMany({
      where: {
        comicId: id,
      },
    }),
    prisma.comic.delete({
      where: { id },
    }),
  ]);
  res.json({ success: true });
});

router.post("/edit", async (req, res) => {
  const { id, name } = req.body;
  const post = await prisma.comic.update({
    where: { id },
    data: {
      name,
    },
  });
  res.json(post);
});

router.get("/query/:id", async (req, res) => {
  const post = await prisma.comic.findUnique({
    where: {
      id: Number(req.params.id),
    },
    include: {
      chapters: true,
      tags: true,
    },
  });
  res.json(post);
});

router.get("/query", async (req, res) => {
  const { id } = req.query;

  if (id) {
    const post = await prisma.comic.findUnique({
      where: {
        id: Number(id),
      },
    });
    res.json(post);
  } else {
    const post = await prisma.comic.findMany({});
    res.json(post);
  }
});

router.get("/scan", async (req, res) => {
  const dir = "D:\\漫画";
  let files = await fs.readdir(dir);
  const data2 = {};

  for (const file of files) {
    const comicName = file;
    const filePath = path.join(dir, file);
    const fileStat = await fs.stat(filePath);
    if (fileStat.isDirectory()) {
      let files = await fs.readdir(filePath);
      // 忽略文件夹
      if (
        files.some((file) => {
          return file === ".ignore";
        })
      ) {
        continue;
      }

      let hasDefault = false;
      for (const file of files) {
        const filePath2 = path.join(filePath, file);

        const fileStat = await fs.stat(filePath2);

        if (fileStat.isFile()) {
          hasDefault = true;
        } else if (fileStat.isDirectory) {
          let files = await fs.readdir(filePath2);
          if (
            files.some((file) => {
              return file === ".ignore";
            })
          ) {
            continue;
          }
          data2[comicName] = data2[comicName] || [];
          data2[comicName].push({ name: file, dir: filePath });
        }
      }
      if (hasDefault) {
        data2[comicName] = data2[comicName] || [];
        data2[comicName].push({ name: "default", dir: filePath });
      }
    }
  }
  for (const [name, chapters] of Object.entries(data2)) {
    // 添加comic
    let post = await prisma.comic.findFirst({
      where: {
        name: name,
      },
    });
    if (!post) {
      post = await prisma.comic.create({
        data: {
          name: name,
        },
      });
    }

    // 添加chapter
    for (const chapter of chapters) {
      let post2 = await prisma.chapter.findFirst({
        where: {
          name: chapter.name,
          comicId: post.id,
          dir: chapter.dir,
        },
      });
      if (!post2) {
        post2 = await prisma.chapter.create({
          data: {
            name: chapter.name,
            comicId: post.id,
            dir: chapter.dir,
          },
        });
      }
    }
  }

  res.json({ success: true });
});

export default router;

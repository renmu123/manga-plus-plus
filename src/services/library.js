import prisma from "../utils/db.js";
import fs from "fs/promises";
import path from "path";

const getLibrary = async (id) => {
  const post = await prisma.library.findUnique({
    where: {
      id: id,
    },
    include: {
      comics: true,
    },
  });
  return post;
};

const getLibrarys = async () => {
  const posts = await prisma.library.findMany({});
  return posts;
};

const editLibrary = async (id, data) => {
  const post = await prisma.library.update({
    where: { id },
    data: data,
  });
  return post;
};

const addLibrary = async (data) => {
  const post = await prisma.library.create({
    data: data,
  });
  return post;
};

const scanLibrary = async (libraryId) => {
  const library = await prisma.library.findUnique({
    where: {
      id: Number(libraryId),
    },
  });
  if (!library) {
    res.status(400).json({ errors: [{ msg: "libraryId不合法" }] });
  }

  const dir = library.dir;
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
        libraryId: libraryId,
      },
    });
    if (!post) {
      post = await prisma.comic.create({
        data: {
          name: name,
          libraryId: libraryId,
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
};

// scan cover
const scanCover = async (libraryId) => {
  // const comics =
};

export default {
  getLibrary,
  getLibrarys,
  editLibrary,
  addLibrary,
  scanLibrary,
};

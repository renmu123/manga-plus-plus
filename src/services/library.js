import prisma from "../utils/db.js";

import fs, { readdir } from "fs/promises";
import path from "path";
import { keyBy, uniqBy } from "lodash-es";

import comicSerice from "./comic.js";
import chapterService from "./chapter.js";
import { filterImg } from "../utils/index.js";

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
    throw new Error("libraryId不合法");
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
          data2[comicName].push({ name: file, dir: filePath2 });
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
        await chapterService.addChapter(data);
      }
    }
  }

  scanCover();
};

// scan cover
const scanCover = async (libraryId) => {
  const comics = await comicSerice.getComics(libraryId);

  const chapterData = [];
  for (const comic of comics) {
    const chapters = await chapterService.getChapters(comic.id);
    for (const chapter of chapters) {
      // if (chapter.cover) continue;
      if (chapter.type === "folder") {
        const names = await readdir(chapter.dir);
        const cover = filterImg(names)[0];
        if (cover) {
          chapterData.push({
            id: chapter.id,
            cover: path.join(chapter.dir, cover),
            comicId: comic.id,
          });
        }
      }
    }
  }

  // update chapter cover
  for (const chapter of chapterData) {
    await chapterService.updateChapter(chapter.id, chapter);
  }

  // update comic cover which has not cover,use the chapter cover default.
  for (const comic of uniqBy(chapterData, "comicId")) {
    if (!keyBy(comics, "id")[comic.comicId].cover) {
      await comicSerice.updateComic(comic.comicId, { cover: comic.cover });
    }
  }
};

export default {
  getLibrary,
  getLibrarys,
  editLibrary,
  addLibrary,
  scanLibrary,
  scanCover,
};

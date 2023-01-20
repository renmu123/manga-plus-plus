import prisma from "../utils/db.js";

const getComics = async (libraryId) => {
  const post = await prisma.comic.findMany({
    where: {
      libraryId: libraryId,
    },
  });
  return post;
};

const getComic = async (id) => {
  const post = await prisma.comic.findUnique({
    where: {
      id: id,
    },
    include: {
      chapters: true,
      tags: true,
    },
  });
  return post;
};

const addComic = async (data) => {
  if (data.tags) {
    data["tags"] = {
      connect: tags.map((tagId) => {
        return { id: tagId };
      }),
    };
  }

  const post = await prisma.comic.create({
    data: data,
  });
  return post;
};

const removeComic = async (id) => {};

const editComic = async (id, data) => {
  const post = await prisma.comic.update({
    where: { id },
    data: data,
  });
  return post;
};

export default {
  getComics,
  getComic,
  addComic,
  addComic,
  editComic,
};

import prisma from "../utils/db.js";

const getChapters = async (comicId) => {
  const post = await prisma.chapter.findMany({
    where: {
      comicId: comicId,
    },
  });
  return post;
};

const getChapter = async (id) => {
  const post = await prisma.chapter.findUnique({
    where: {
      id: id,
    },
    // include: {
    //   comic: true,
    // },
  });
  return post;
};

const addChapter = async (data) => {
  const post = await prisma.chapter.create({
    data: data,
  });
  return post;
};

const removeChapter = async (id) => {
  const post = await prisma.chapter.delete({
    where: { id },
  });
  return post;
};

const updateChapter = async (id, data) => {
  const post = await prisma.chapter.update({
    where: { id },
    data: data,
  });
  return post;
};

export default {
  getChapters,
  getChapter,
  addChapter,
  addChapter,
  updateChapter,
  removeChapter,
};

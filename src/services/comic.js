import prisma from "../utils/db.js";
import { isEmpty } from "lodash-es";

const getComics = async (
  libraryId,
  includeChapters = false,
  pagination = {}
) => {
  if (isEmpty(pagination)) {
    const post = await prisma.comic.findMany({
      where: {
        libraryId: libraryId,
      },
      include: {
        chapters: includeChapters,
      },
    });
    return post;
  } else {
    const queryData = {
      take: pagination.size,
      skip: 1,
      cursor: {
        id: pagination.idCursor,
      },
      where: {
        libraryId: libraryId,
      },
      include: {
        chapters: includeChapters,
      },
    };

    if (!pagination.idCursor) {
      delete queryData.skip;
      delete queryData.cursor;
    }
    const post = await prisma.comic.findMany(queryData);
    return post;
  }
};

const getComic = async (id, include = {}) => {
  const post = await prisma.comic.findUnique({
    where: {
      id: id,
    },
    include: {
      chapters: include.chapters ?? false,
      tags: include.tags ?? true,
      authors: include.authors ?? true,
    },
  });
  return post;
};

const addComic = async (data) => {
  if (data.tags) {
    data["tags"] = {
      connect: data.tags.map((tagId) => {
        return { id: tagId };
      }),
    };
  }
  if (data.authors) {
    data["authors"] = {
      connect: data.authors.map((id) => {
        return { id: id };
      }),
    };
  }

  const post = await prisma.comic.create({
    data: data,
  });
  return post;
};

const removeComic = async (id) => {
  const post = await prisma.comic.delete({
    where: { id },
  });
  return post;
};

const updateComic = async (id, data) => {
  if (data.tags) {
    data["tags"] = {
      set: data.tags.map((tagId) => {
        return { id: tagId };
      }),
    };
  }
  if (data.authors) {
    data["authors"] = {
      set: data.authors.map((id) => {
        return { id: id };
      }),
    };
  }

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
  updateComic,
  removeComic,
};

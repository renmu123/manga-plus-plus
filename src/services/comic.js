import prisma from "../utils/db.js";
import { isEmpty } from "lodash-es";

const getComics = async (
  libraryId,
  include = {},
  pagination = {},
  filter = {},
  orderBy = {}
) => {
  const queryData = {
    where: {
      AND: [
        {
          libraryId: libraryId,
          status: filter.status,
          readingStatus: filter.readingStatus,
        },
      ],
    },
    include: {
      chapters: include.chapters ?? false,
    },
    orderBy: orderBy,
  };

  if (!isEmpty(pagination)) {
    queryData.take = pagination.size;
    queryData.skip = 1;
    queryData.cursor = {
      id: pagination.idCursor,
    };

    if (!pagination.idCursor) {
      delete queryData.skip;
      delete queryData.cursor;
    }
  }
  if (!isEmpty(filter)) {
    if (filter.tags && filter.tags.length !== 0) {
      queryData.where.AND.push({
        tags: {
          some: { id: { in: filter.tags } },
        },
      });
    }
    if (filter.authors && filter.authors.length !== 0) {
      queryData.where.AND.push({
        authors: {
          some: { id: { in: filter.authors } },
        },
      });
    }
  }
  const post = await prisma.comic.findMany(queryData);
  return post;
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

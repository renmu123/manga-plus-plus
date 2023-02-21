import request from "./axios";

const add = (params: any) => {
  return request.get("/comic/add", { params });
};

const remove = (id: number) => {
  return request.post("/comic/remove", { id });
};
const edit = (data: any) => {
  return request.post("/comic/edit", data);
};
const query = (id: number, params = {}) => {
  return request.get(`/comic/query/${id}`, { params });
};
const list = (params: {
  libraryId: number;
  idCursor?: number;
  size?: number;
}) => {
  return request.get("/comic/list", { params });
};

const recentAdded = (params: { size: number }) => {
  return request.get("/comic/recentAdded", { params });
};

export default {
  add,
  remove,
  edit,
  query,
  list,
  recentAdded,
};

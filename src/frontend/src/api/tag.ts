import request from "./axios";

const add = (data: { name: string }) => {
  return request.post("/tag/add", data);
};

const addMany = (data: { names: string[] }) => {
  return request.post("/tag/addMany", data);
};

const query = (id: number, params = {}) => {
  return request.get(`/tag/query/${id}`, { params });
};
const list = (params: any = {}) => {
  return request.get("/tag/list", { params });
};
export default {
  add,
  query,
  list,
  addMany,
};

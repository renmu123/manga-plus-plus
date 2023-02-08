import request from "./axios";

const add = (data: { name: string }) => {
  return request.post("/author/add", data);
};
const addMany = (data: { names: string[] }) => {
  return request.post("/author/addMany", data);
};

const query = (id: number, params = {}) => {
  return request.get(`/author/query/${id}`, { params });
};
const list = (params: any = {}) => {
  return request.get("/author/list", { params });
};
export default {
  add,
  query,
  list,
  addMany,
};

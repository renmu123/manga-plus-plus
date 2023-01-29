import request from "./axios";

const add = (params: any) => {
  return request.get("/library/add", { params });
};

const remove = (id: Number) => {
  return request.post("/library/remove", { id });
};
const edit = (data: any) => {
  return request.post("/library/edit", data);
};
const query = (id: Number) => {
  return request.get("/library/add", { params: { id } });
};
const list = (params: any) => {
  return request.get("/library/list", { params });
};
const scan = (id: Number) => {
  return request.get("/library/scan", { params: { id } });
};
const scanCover = (id: Number) => {
  return request.get("/library/list", { params: { id } });
};
export default {
  add,
  remove,
  edit,
  query,
  list,
  scan,
  scanCover,
};

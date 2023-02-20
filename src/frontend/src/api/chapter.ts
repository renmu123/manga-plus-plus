import request from "./axios";

const edit = (data: { name: string }) => {
  return request.post("/chapter/edit", data);
};

const remove = (id: number) => {
  return request.post("/chapter/remove", {
    id,
  });
};

const download = (id: number) => {
  return request.post(
    "/chapter/download",
    {
      id,
    },
    { responseType: "blob" }
  );
};

const query = (id: number, params = {}) => {
  return request.get(`/chapter/query/${id}`, { params });
};
const list = (params: any = {}) => {
  return request.get("/chapter/list", { params });
};

const getImages = (id: number, params: any = {}) => {
  return request.get(`/chapter/query/${id}/images`, { params });
};
export default {
  edit,
  query,
  list,
  getImages,
  remove,
  download,
};

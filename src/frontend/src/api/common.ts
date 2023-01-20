import request from "./axios";

const fileSystem = (params) => {
  return request.get("/path/filesystem", { params });
};

export default {
  fileSystem,
};

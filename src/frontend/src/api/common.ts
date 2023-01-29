import request from "./axios";

const fileSystem = (params: any) => {
  return request.get("/common/filesystem", { params });
};

export default {
  fileSystem,
};

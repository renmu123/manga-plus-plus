import request from "./axios";

const fileSystem = (params: any) => {
  return request.get("/common/filesystem", { params });
};

const uploadCover = (formData: any) => {
  return request.post("/common/cover/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export default {
  fileSystem,
  uploadCover,
};

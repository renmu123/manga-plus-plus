import validate from "./valid.js";
import path from "path";

const filterImgFile = (names) => {
  return names.filter((name) => {
    return isImgFile(name);
  });
};

const isImgFile = (name) => {
  const extList = [".png", ".jpg", ".gif", ".webp"];
  if (extList.includes(path.extname(name))) {
    return true;
  } else {
    return false;
  }
};

const idArchiveFile = (name) => {
  const extList = [".zip"];
  if (extList.includes(path.extname(name))) {
    return true;
  } else {
    return false;
  }
};

export { validate, filterImgFile, isImgFile, idArchiveFile };

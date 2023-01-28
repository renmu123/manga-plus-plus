import validate from "./valid.js";
import path from "path";
import fs from "fs-extra";
import crypto from "crypto";

import appRoot from "app-root-path";

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

const copyCoverToMetadata = async (file) => {
  const rootPath = path.join(appRoot.path, "metadata", "cover");
  await fs.ensureDir(rootPath);
  const randomName = crypto.randomBytes(16).toString("hex");

  const { ext } = path.parse(file);
  const coverPath = path.join(rootPath, `${randomName}${ext}`);

  await fs.copy(file, coverPath);
  return coverPath;
};

const writeCoverToMetadata = async (fileBuffer) => {
  const rootPath = path.join(appRoot.path, "metadata", "cover");
  await fs.ensureDir(rootPath);
  const randomName = crypto.randomBytes(16).toString("hex");

  // const { ext } = path.parse(file);
  const coverPath = path.join(rootPath, `${randomName}.jpg`);
  await fs.writeFile(coverPath, fileBuffer, "binary");

  return coverPath;
};

export {
  validate,
  filterImgFile,
  isImgFile,
  idArchiveFile,
  copyCoverToMetadata,
  writeCoverToMetadata,
};

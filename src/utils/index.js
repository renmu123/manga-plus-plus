import validate from "./valid.js";
import path from "path";

const filterImg = (names) => {
  const extList = [".png", ".jpg", ".gif", ".webp"];

  const extSet = new Set(extList);
  return names.filter((name) => {
    return extSet.has(path.extname(name));
  });
};

export { validate, filterImg };

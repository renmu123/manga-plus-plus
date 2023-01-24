import appRoot from "app-root-path";
import fs from "fs";
import path from "path";

const CONFIGPATH = path.join(appRoot.path, "setting.json");

const defaultConfig = {
  name: "manga++",
};

class Config {
  constructor() {
    this.data = {};
    if (fs.existsSync(CONFIGPATH)) {
      this.load();
    } else {
      this.init();
      this.load();
    }
  }
  init() {
    let data = JSON.stringify(defaultConfig);
    fs.writeFileSync(CONFIGPATH, data);
  }
  load() {
    let data = fs.readFileSync(CONFIGPATH);
    this.data = JSON.parse(data);
  }
  get(key) {
    return this.data[key];
  }
  set(key, val) {
    this.data[key] = val;
  }
}

const config = new Config();

export default config;

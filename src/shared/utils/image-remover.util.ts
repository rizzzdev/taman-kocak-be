import fs from "fs";

export const imageRemover = (path: string) => {
  if (fs.existsSync(process.cwd() + path)) {
    fs.unlinkSync(process.cwd() + path);
  }
};

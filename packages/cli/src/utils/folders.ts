import fs from 'fs';
import { join, normalize } from 'path';

export const createFolders = (dirArr: string[]) => {
  let folderPath = '.';
  for (const path of dirArr) {
    folderPath = join(folderPath, path);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
  }
  return normalize(folderPath);
};
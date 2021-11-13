import fs from 'fs';

export const createFolders = (dirArr: string[]) => {
  let folderPath = '.';
  for (let i = 0; i < dirArr.length - 1; i++) {
    const part = dirArr[i];
    folderPath += `/${part}`
    if (!fs.existsSync(folderPath)) {
      console.log(`Creating directory ${folderPath}`);
      fs.mkdirSync(folderPath);
    }
  }
  return folderPath;
};
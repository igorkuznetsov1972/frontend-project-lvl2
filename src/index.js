/* eslint-disable import/extensions */
/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import parseFile from './parsers.js';
import genAST from './genAST.js';
import formatter from './formatters/index.js';

const gendiffCore = (filePath1, filePath2, formatterName) => {
  if (fs.existsSync(filePath1) && fs.existsSync(filePath2)) {
    const fileExtention1 = path.extname(filePath1);
    const fileExtention2 = path.extname(filePath2);
    const fileContent1 = parseFile(fs.readFileSync(filePath1, 'UTF-8'), fileExtention1);
    const fileContent2 = parseFile(fs.readFileSync(filePath2, 'UTF-8'), fileExtention2);
    const ast = genAST(fileContent1, fileContent2);
    return formatter(ast, formatterName);
  }
  throw new Error('No such file or directory');
};
export default gendiffCore;

import fs from 'fs';
import path from 'path';
import parse from './parsers.js';
import genAST from './genAST.js';
import format from './formatters/index.js';

const gendiff = (filePath1, filePath2, formatterName) => {
  const fileExtention1 = path.extname(filePath1);
  const fileExtention2 = path.extname(filePath2);
  const fileContent1 = parse(fs.readFileSync(filePath1, 'UTF-8'), fileExtention1);
  const fileContent2 = parse(fs.readFileSync(filePath2, 'UTF-8'), fileExtention2);
  const ast = genAST(fileContent1, fileContent2);
  return format(ast, formatterName);
};
export default gendiff;

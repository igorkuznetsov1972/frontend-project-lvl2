/* eslint-disable import/extensions */
/* eslint-disable no-console */
import parseFile from './parsers.js';
import genAST from './genAST.js';

const gendiffCore = (filePath1, filePath2) => {
  const file1 = parseFile(filePath1);
  const file2 = parseFile(filePath2);
  const result = genAST(file1, file2);
  return result;
};
export default gendiffCore;

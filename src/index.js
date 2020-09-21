/* eslint-disable import/extensions */
/* eslint-disable no-console */
import parseFile from './parsers.js';
import genAST from './genAST.js';

const gendiffCore = (filePath1, filePath2) => {
  const fileContent1 = parseFile(filePath1);
  const fileContent2 = parseFile(filePath2);
  const result = genAST(fileContent1, fileContent2);
  return result;
};
export default gendiffCore;

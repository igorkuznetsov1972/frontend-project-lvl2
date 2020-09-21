/* eslint-disable import/extensions */
/* eslint-disable no-console */
import parseFile from './parsers.js';
import genAST from './genAST.js';
import formatter from '../formatters/index.js';

const gendiffCore = (filePath1, filePath2, formatterName) => {
  const fileContent1 = parseFile(filePath1);
  const fileContent2 = parseFile(filePath2);
  const result = genAST(fileContent1, fileContent2);
  return formatter(result, formatterName);
};
export default gendiffCore;

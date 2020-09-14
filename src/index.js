/* eslint-disable import/extensions */
/* eslint-disable no-console */
// import fs from 'fs';
import _ from 'lodash';
import parseFile from './parsers.js';
import genAST from './genAST.js';
import stylishFormatter from './stylish.js';

const gendiffCore = (filepath1, filepath2) => {
  const file1 = parseFile(filepath1);
  const file2 = parseFile(filepath2);
  const result = genAST(file1, file2);
  console.log(stylishFormatter(result));
};
export default gendiffCore;

/* eslint-disable import/extensions */
/* eslint-disable no-console */
// import fs from 'fs';
import _ from 'lodash';
import parseFile from './parsers.js';

const gendiffCore = (filepath1, filepath2) => {
  const file1 = parseFile(filepath1);
  const file2 = parseFile(filepath2);
  const result = {};
  _.forOwn(file1, (value, key) => {
    if (file1[key] === file2[key]) {
      result[`  ${key}`] = file1[key];
    } else if (!_.has(file2, key)) {
      result[`- ${key}`] = file1[key];
    } else {
      result[`+ ${key}`] = file2[key];
      result[`- ${key}`] = file1[key];
    }
  });
  _.forOwn(file2, (value, key) => {
    if (!_.has(file1, key)) {
      result[`+ ${key}`] = file2[key];
    }
  });
  const diffFile = _.toPairs(result).map((x) => x.join(': '));
  const diffFilePrintable = `{\n${diffFile.join('\n')}\n}`;
  console.log(diffFilePrintable);
  return diffFilePrintable;
};
export default gendiffCore;

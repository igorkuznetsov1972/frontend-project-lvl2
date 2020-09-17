/* eslint-disable import/extensions */
/* eslint-disable no-console */
import parseFile from '../src/parsers.js';
import genAST from '../src/genAST.js';
import stylish from './stylish.js';
import plain from './plain.js';

const gendiffCore = (filepath1, filepath2, formatter = 'stylish') => {
  const file1 = parseFile(filepath1);
  const file2 = parseFile(filepath2);
  const result = genAST(file1, file2);
  switch (formatter) {
    case 'stylish':
      console.log(stylish(result));
      return (stylish(result));
    case 'plain':
      console.log(plain(result));
      return (plain(result));
    default:
      throw new Error('Invalid formatter type');
  }
};
export default gendiffCore;

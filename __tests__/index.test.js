/* eslint-disable import/extensions */
/* eslint-disable no-underscore-dangle */
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { test, expect, describe } from '@jest/globals';
import gendiffCore from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (fileName) => path.join(__dirname, '..', '__fixtures__', fileName);
const readFile = (fileName) => fs.readFileSync(getFixturePath(fileName), 'utf-8');
describe.each([
  ['JSON', 'nestedFile1.json', 'nestedFile2.json', 'nestedResult.txt'],
  ['YAML', 'file1.yaml', 'file2.yaml', 'result.txt'],
  ['INI', 'file1.ini', 'file2.ini', 'result.txt'],
  ['JSON', 'nestedFile1.json', 'nestedFile2.json', 'plainResult.txt', 'plain'],
  ['JSON', 'nestedFile1.json', 'nestedFile2.json', 'jsonResult.txt', 'json'],
])('Difference', (name, fileName1, fileName2, expected, format) => {
  test(`${name} files, ${format || 'stylish'} output format`, () => {
    const filePath1 = getFixturePath(fileName1);
    const filePath2 = getFixturePath(fileName2);
    const result = readFile(expected);
    expect(gendiffCore(filePath1, filePath2, format)).toEqual(result);
  });
});
describe.each([
  ['Wrong file type', 'nestedFile1.txt', 'nestedFile2.txt', 'Invalid file type'],
  ['No such file', 'NotSuchNestedFile1.no', 'NotSuchNestedFile2.no', 'No such file or directory'],
  ['Invalid formatter type', 'nestedFile1.json', 'nestedFile2.json', 'Invalid formatter type', 'other'],
])('Arguments', (name, fileName1, fileName2, error, format) => {
  test(`${name}`, () => {
    const filePath1 = getFixturePath(fileName1);
    const filePath2 = getFixturePath(fileName2);
    expect(() => {
      gendiffCore(filePath1, filePath2, format);
    }).toThrow(`${error}`);
  });
});

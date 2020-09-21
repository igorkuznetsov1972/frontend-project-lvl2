/* eslint-disable import/extensions */
/* eslint-disable jest/no-commented-out-tests */
/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line import/extensions
import { fileURLToPath } from 'url';
// import { dirname } from 'path';
import path from 'path';
import fs from 'fs';
import { test, expect, describe } from '@jest/globals';
import gendiffCore from '../src/index.js';
import formatter from '../formatters/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');
describe.each([
  ['JSON', 'nestedFile1.json', 'nestedFile2.json', 'nestedResult.txt'],
  ['YAML', 'file1.yaml', 'file2.yaml', 'result.txt'],
  ['INI', 'file1.ini', 'file2.ini', 'result.txt'],
  ['JSON', 'nestedFile1.json', 'nestedFile2.json', 'plainResult.txt', 'plain'],
  ['JSON', 'nestedFile1.json', 'nestedFile2.json', 'jsonResult.txt', 'json'],
])('Difference', (name, file1, file2, expected, format) => {
  test(`${name} files, ${format || 'stylish'} output format`, () => {
    const filepath1 = getFixturePath(file1);
    const filepath2 = getFixturePath(file2);
    const result = readFile(expected);
    expect(gendiffCore(filepath1, filepath2, format)).toEqual(result);
  });
});
describe.each([
  ['Wrong file type', 'nestedFile1.txt', 'nestedFile2.txt', 'Invalid file type'],
  ['No such file', 'NotSuchNestedFile1.no', 'NotSuchNestedFile2.no', 'No such file or directory'],
  ['Invalid formatter type', 'nestedFile1.json', 'nestedFile2.json', 'Invalid formatter type', 'other'],
])('Arguments', (name, file1, file2, error, format) => {
  test(`${name}`, () => {
    const filepath1 = getFixturePath(file1);
    const filepath2 = getFixturePath(file2);
    expect(() => {
      gendiffCore(filepath1, filepath2, format);
    }).toThrow(`${error}`);
  });
});

/* eslint-disable no-underscore-dangle */
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { test, expect, describe } from '@jest/globals';
import gendiff from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (fileName) => path.join(__dirname, '..', '__fixtures__', fileName);
const readFile = (fileName) => fs.readFileSync(getFixturePath(fileName), 'utf-8');

describe.each([
  ['JSON', 'nestedFile1.json', 'nestedFile2.json', 'nestedResult.txt'],
  ['YAML', 'nestedFile1.yml', 'nestedFile2.yml', 'nestedYamlResult.txt'],
  ['JSON', 'nestedFile1.json', 'nestedFile2.json', 'plainResult.txt', 'plain'],
  ['JSON', 'nestedFile1.json', 'nestedFile2.json', 'jsonResult.txt', 'json'],
])('Difference', (name, fileName1, fileName2, expected, format) => {
  test(`${name} files, ${format || 'stylish'} output format`, () => {
    const filePath1 = getFixturePath(fileName1);
    const filePath2 = getFixturePath(fileName2);
    const result = readFile(expected);
    expect(gendiff(filePath1, filePath2, format)).toEqual(result);
  });
});

describe.each([
  ['Wrong file type', 'nestedFile1.txt', 'nestedFile2.txt', 'This program can not compare *.txt files'],
  ['Invalid formatter type', 'nestedFile1.json', 'nestedFile2.json', '"doc" - no such formatter type', 'doc'],
])('Arguments', (name, fileName1, fileName2, error, format) => {
  test(`${name}`, () => {
    const filePath1 = getFixturePath(fileName1);
    const filePath2 = getFixturePath(fileName2);
    expect(() => {
      gendiff(filePath1, filePath2, format);
    }).toThrow(`${error}`);
  });
});

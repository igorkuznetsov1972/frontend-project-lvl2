/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line import/extensions
import { fileURLToPath } from 'url';
// import { dirname } from 'path';
import path from 'path';
import fs from 'fs';
import { test, expect } from '@jest/globals';
import gendiffCore from '../src/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');
test('JSON files difference', () => {
  const filepath1 = getFixturePath('file1.json');
  const filepath2 = getFixturePath('file2.json');
  const result = readFile('result.txt');
  expect(gendiffCore(filepath1, filepath2)).toEqual(result);
});
test('Yaml files difference', () => {
  const filepath1 = getFixturePath('file1.yaml');
  const filepath2 = getFixturePath('file2.yaml');
  const result = readFile('result.txt');
  expect(gendiffCore(filepath1, filepath2)).toEqual(result);
});
test('Wrong file type', () => {
  const filepath1 = getFixturePath('file1.txt');
  const filepath2 = getFixturePath('file2.txt');
  expect(() => {
    gendiffCore(filepath1, filepath2);
  }).toThrow('Invalid file type');
});
test('No such file', () => {
  const filepath1 = getFixturePath('NotSuchFile1.no');
  const filepath2 = getFixturePath('NotSuchFile2.no');
  expect(() => {
    gendiffCore(filepath1, filepath2);
  }).toThrow('No such file or directory');
});

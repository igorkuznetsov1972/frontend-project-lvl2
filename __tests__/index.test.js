/* eslint-disable jest/no-commented-out-tests */
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
  const filepath1 = getFixturePath('nestedFile1.json');
  const filepath2 = getFixturePath('nestedFile2.json');
  const nestedResult = readFile('nestedResult.txt');
  expect(gendiffCore(filepath1, filepath2)).toEqual(nestedResult);
});
/* test('Yaml files difference', () => {
  const filepath1 = getFixturePath('nestedFile1.yaml');
  const filepath2 = getFixturePath('nestedFile2.yaml');
  const nestedResult = readFile('nestedResult.txt');
  expect(gendiffCore(filepath1, filepath2)).toEqual(nestedResult);
});
test('ini files difference', () => {
  const filepath1 = getFixturePath('nestedFile1.ini');
  const filepath2 = getFixturePath('nestedFile2.ini');
  const nestedResult = readFile('nestedResult.txt');
  expect(gendiffCore(filepath1, filepath2)).toEqual(nestedResult);
}); */
test('Wrong file type', () => {
  const filepath1 = getFixturePath('nestedFile1.txt');
  const filepath2 = getFixturePath('nestedFile2.txt');
  expect(() => {
    gendiffCore(filepath1, filepath2);
  }).toThrow('Invalid file type');
});
test('No such file', () => {
  const filepath1 = getFixturePath('NotSuchNestedFile1.no');
  const filepath2 = getFixturePath('NotSuchNestedFile2.no');
  expect(() => {
    gendiffCore(filepath1, filepath2);
  }).toThrow('No such file or directory');
});
test('Invalid formatter type', () => {
  const filepath1 = getFixturePath('nestedFile1.json');
  const filepath2 = getFixturePath('nestedFile2.json');
  expect(() => {
    gendiffCore(filepath1, filepath2, 'other');
  }).toThrow('Invalid formatter type');
});

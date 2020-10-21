#! /usr/bin/env node
import commander from 'commander';
import gendiff from '../src/index.js';

const { program } = commander;

program
  .version('0.0.5')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<filePath1> <filePath2>')
  .option('-f, --format [formatter]', 'output format [stylish, plain or json]', 'stylish')
  .action((filePath1, filePath2) => {
    // eslint-disable-next-line no-console
    console.log(gendiff(filePath1, filePath2, program.format));
  });
program.parse(process.argv);

#! /usr/bin/env node
import commander from 'commander';
// eslint-disable-next-line import/extensions
import formatter from '../formatters/index.js';
// eslint-disable-next-line import/extensions
import gendiffCore from '../src/index.js';

const { program } = commander;

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<filePath1> <filePath2>')
  .option('-f, --format [formatter]', 'output format [formatter]', 'stylish')
  .action((filePath1, filePath2) => {
    // eslint-disable-next-line no-console
    console.log(formatter(gendiffCore(filePath1, filePath2), program.format));
  });
program.parse(process.argv);

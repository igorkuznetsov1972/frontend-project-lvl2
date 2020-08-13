#! /usr/bin/env node
import commander from 'commander';
// eslint-disable-next-line import/extensions
import gendiffCore from '../src/index.js';

const { program } = commander;

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format', 'output format')
  .action((filepath1, filepath2) => { gendiffCore(filepath1, filepath2); });
program.parse(process.argv);

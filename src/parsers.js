import fs from 'fs';
import yaml from 'js-yaml';
import ini from '@ghostff/ini_parser';
import path from 'path';

export default (filePath) => {
  if (fs.existsSync(filePath)) {
    if (path.extname(filePath) === '.json') {
      return JSON.parse(fs.readFileSync(filePath, 'UTF-8'));
    }
    if (path.extname(filePath) === '.yaml' || path.extname(filePath) === '.yml') {
      return yaml.safeLoad(fs.readFileSync(filePath, 'UTF-8'));
    }
    if (path.extname(filePath) === '.ini') {
      return ini.parseSync(filePath, true, true);
    }
    throw new Error('Invalid file type');
  }
  throw new Error('No such file or directory');
};

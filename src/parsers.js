import fs from 'fs';
import yaml from 'js-yaml';
import ini from 'ini';
import path from 'path';

export default (filepath) => {
  if (fs.existsSync(filepath)) {
    if (path.extname(filepath) === '.json') {
      return JSON.parse(fs.readFileSync(filepath, 'UTF-8'));
    }
    if (path.extname(filepath) === '.yaml' || path.extname(filepath) === '.yml') {
      return yaml.safeLoad(fs.readFileSync(filepath, 'UTF-8'));
    }
    if (path.extname(filepath) === '.ini') {
      return ini.parse(fs.readFileSync(filepath, 'UTF-8'));
    }
    throw new Error('Invalid file type');
  }
  throw new Error('No such file or directory');
};

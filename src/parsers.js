import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';

export default (filepath) => {
  if (fs.existsSync(filepath)) {
    if (path.extname(filepath) === '.json') {
      return JSON.parse(fs.readFileSync(filepath));
    }
    if (path.extname(filepath) === '.yaml' || path.extname(filepath) === '.yml') {
      return yaml.safeLoad(fs.readFileSync(filepath));
    }
    throw new Error('Invalid file type');
  }
  throw new Error('No such file or directory');
};

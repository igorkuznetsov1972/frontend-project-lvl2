import yaml from 'js-yaml';
import ini from '@ghostff/ini_parser';

export default (fileContent, fileExtention) => {
  if (fileExtention === '.json') {
    return JSON.parse(fileContent);
  }
  if (fileExtention === '.yaml' || fileExtention === '.yml') {
    return yaml.safeLoad(fileContent);
  }
  if (fileExtention === '.ini') {
    return ini.parseString(fileContent, true, true);
  }
  throw new Error('Invalid file type');
};

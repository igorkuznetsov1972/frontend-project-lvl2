import yaml from 'js-yaml';
import ini from '@ghostff/ini_parser';

const parsersTable = {
  '.json': JSON.parse,
  '.yaml': yaml.safeLoad,
  '.yml': yaml.safeLoad,
  '.ini': ini.parseString,
};
export default (fileContent, fileExtention) => {
  if (parsersTable[fileExtention]) return parsersTable[fileExtention](fileContent);
  throw new Error('Invalid file type');
};

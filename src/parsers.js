import yaml from 'js-yaml';
import ini from '@ghostff/ini_parser';

const parsersTable = {
  '.json': JSON.parse,
  '.yaml': yaml.safeLoad,
  '.yml': yaml.safeLoad,
  '.ini': ini.parseString,
};
export default (data, fileExtention) => {
  if (!parsersTable[fileExtention]) throw new Error(`This program can not compare *${fileExtention} files`);
  return parsersTable[fileExtention](ast);
};

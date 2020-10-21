/* eslint-disable import/extensions */
/* eslint-disable no-console */
import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

const formattersTable = {
  stylish,
  plain,
  json,
};
const format = (ast, formatterName = 'stylish') => {
  if (!formattersTable[formatterName]) throw new Error(`"${formatterName}" - no such formatter type`);
  return formattersTable[formatterName](ast);
};
export default format;

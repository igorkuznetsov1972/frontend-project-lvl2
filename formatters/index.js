/* eslint-disable import/extensions */
/* eslint-disable no-console */
import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

const formatter = (ast, formatterName = 'stylish') => {
  switch (formatterName) {
    case 'stylish':
      return (stylish(ast));
    case 'plain':
      return (plain(ast));
    case 'json':
      return (json(ast));
    default:
      throw new Error('Invalid formatter type');
  }
};
export default formatter;

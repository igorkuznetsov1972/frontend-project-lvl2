import _ from 'lodash';

const buildString = (value) => {
  if (_.isPlainObject(value)) return '[complex value]';
  return _.isString(value) ? `'${value}'` : `${value}`;
};

export default (ast) => {
  const buildPlainOutput = (obj, ancestry) => obj.map((node) => {
    const {
      name, children, type, beforeValue, afterValue,
    } = node;
    const ancestryPath = ancestry === '' ? `${name}` : `${ancestry}.${name}`;
    switch (type) {
      case 'unchanged':
        return null;
      case 'nested':
        return buildPlainOutput(children, ancestryPath);
      case 'changed':
        return `Property '${ancestryPath}' was updated. From ${buildString(beforeValue)} to ${buildString(afterValue)}\n`;
      case 'removed':
        return `Property '${ancestryPath}' was removed\n`;
      case 'added':
        return `Property '${ancestryPath}' was added with value: ${buildString(afterValue)}\n`;
      default:
        return new Error(`${type} is not a valid node type`);
    }
  });
  return _.flattenDeep(buildPlainOutput(ast, '')).join('').trimEnd();
};

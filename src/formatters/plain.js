import _ from 'lodash';

const stringifyValue = (value) => {
  if (_.isPlainObject(value)) return '[complex value]';
  return _.isString(value) ? `'${value}'` : `${value}`;
};

export default (data) => {
  const stringify = (obj, ancestry) => obj.map((node) => {
    const {
      name, children, type, beforeValue, afterValue,
    } = node;
    const ancestryPath = ancestry === '' ? `${name}` : `${ancestry}.${name}`;
    switch (type) {
      case 'unchanged':
        return null;
      case 'nested':
        return stringify(children, ancestryPath);
      case 'changed':
        return `Property '${ancestryPath}' was updated. From ${stringifyValue(
          beforeValue,
        )} to ${stringifyValue(afterValue)}`;
      case 'removed':
        return `Property '${ancestryPath}' was removed`;
      case 'added':
        return `Property '${ancestryPath}' was added with value: ${stringifyValue(
          afterValue,
        )}`;
      default:
        return new Error(`${type} is not a valid node type`);
    }
  });
  return _.pull(_.flattenDeep(stringify(data, '')), null).join('\n');
};

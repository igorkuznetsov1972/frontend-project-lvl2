import _ from 'lodash';

export default (ast) => {
  const result = [];
  const buildPlainOutput = (acc, obj) => {
    const { name, type, children = false } = obj;
    acc.push(`${name}`);
    if (children) {
      acc.push('.');
      _.forEach(_.sortBy(children), (child) => {
        buildPlainOutput(acc.slice(), child);
      });
    }
    const buildString = (value, status, eol) => {
      if (_.isPlainObject(value)) {
        result.push(`${acc.join('')}' ${status} [complex value]${eol}`);
      } else if (value === false || value === true) {
        result.push(`${acc.join('')}' ${status} ${value}${eol}`);
      } else result.push(`${acc.join('')}' ${status} '${value}'${eol}`);
    };
    switch (type) {
      case 'changed':
        buildString(obj.beforeValue, 'was updated. From', ' to ');
        if (_.isPlainObject(obj.afterValue)) {
          result.push('[complex value]\n');
        } else if (obj.afterValue === false || obj.afterValue === true) {
          result.push(`${obj.afterValue}\n`);
        } else result.push(`'${obj.afterValue}'\n`);
        break;
      case 'removed':
        result.push(`${acc.join('')}' was removed\n`);
        break;
      case 'added':
        buildString(obj.afterValue, 'was added with value:', '\n');
        break;
      default:
        break;
    }
  };
  ast.forEach((obj) => {
    buildPlainOutput(["Property '"], obj);
  });
  return result.flat().join('').trimEnd();
};

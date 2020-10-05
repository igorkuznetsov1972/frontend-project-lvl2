import _ from 'lodash';

export default (ast) => {
  const result = [];
  const buildPlainOutput = (obj, acc) => {
    acc.push(`${obj.name}`);
    if (_.has(obj, 'children')) {
      acc.push('.');
      _.forEach(_.sortBy(obj.children), (child) => {
        buildPlainOutput(child, acc.slice(0, acc.length));
      });
    }
    const buildString = (value, status, eol) => {
      if (_.isPlainObject(value)) {
        result.push(`${acc.slice(0, acc.length).join('')}' ${status} [complex value]${eol}`);
      } else if (value === false || value === true) {
        result.push(`${acc.slice(0, acc.length).join('')}' ${status} ${value}${eol}`);
      } else result.push(`${acc.slice(0, acc.length).join('')}' ${status} '${value}'${eol}`);
    };
    switch (obj.type) {
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
    buildPlainOutput(obj, ["Property '"]);
  });
  return result.flat().join('').trimEnd();
};

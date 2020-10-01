import _ from 'lodash';

export default (ast) => {
  const result = [];
  const build = (arr, acc) => {
    acc.push(`${arr[0]}`);
    if (_.has(arr[1], 'children')) {
      acc.push('.');
      _.sortBy((arr[1].children)).forEach((child) => {
        build(child, acc.slice(0, acc.length));
      });
    }
    if (!_.has(arr[1], 'type')) return;
    const buildString = (value, status, eol) => {
      if (_.isPlainObject(value)) {
        result.push(`${acc.slice(0, acc.length).join('')}' ${status} [complex value]${eol}`);
      } else if (value === false || value === true) {
        result.push(`${acc.slice(0, acc.length).join('')}' ${status} ${value}${eol}`);
      } else result.push(`${acc.slice(0, acc.length).join('')}' ${status} '${value}'${eol}`);
    };
    switch (arr[1].type) {
      case 'changed':
        buildString(arr[1].beforeValue, 'was updated. From', ' to ');
        if (_.isPlainObject(arr[1].afterValue)) {
          result.push('[complex value]\n');
        } else if (arr[1].afterValue === false || arr[1].afterValue === true) {
          result.push(`${arr[1].afterValue}\n`);
        } else result.push(`'${arr[1].afterValue}'\n`);
        break;
      case 'removed':
        result.push(`${acc.join('')}' was removed\n`);
        break;
      case 'added':
        buildString(arr[1].afterValue, 'was added with value:', '\n');
        break;
      default:
        break;
    }
  };
  ast.forEach((arr) => {
    build(arr, ["Property '"]);
  });
  return result.flat().join('').trimEnd();
};

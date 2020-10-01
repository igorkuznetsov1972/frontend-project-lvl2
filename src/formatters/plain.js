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
    switch (arr[1].type) {
      case 'changed':
        if (_.isPlainObject(arr[1].beforeValue)) {
          result.push(`${acc.slice(0, acc.length).join('')}' was updated. From [complex value] to `);
        } else if (arr[1].beforeValue === false || arr[1].beforeValue === true) {
          result.push(`${acc.slice(0, acc.length).join('')}' was updated. From ${arr[1].beforeValue} to `);
        } else result.push(`${acc.slice(0, acc.length).join('')}' was updated. From '${arr[1].beforeValue}' to `);
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
        if (_.isPlainObject(arr[1].afterValue)) {
          result.push(`${acc.join('')}' was added with value: [complex value]\n`);
        } else if (arr[1].afterValue === false || arr[1].afterValue === true) {
          result.push(`${acc.join('')}' was added with value: ${arr[1].afterValue}\n`);
        } else result.push(`${acc.join('')}' was added with value: '${arr[1].afterValue}'\n`);
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

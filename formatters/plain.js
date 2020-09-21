import _ from 'lodash';

export default (ast) => {
  const result = [];

  const build = (arr, acc, prevDepth) => {
    acc.push(`${arr[0]}`);
    let depth = prevDepth + 1;
    if (Array.isArray(arr)) {
      if (_.has(arr[1], 'children')) {
        depth += 1;
        acc.push('.');
        _.toPairs(arr[1].children).sort().filter((child) => child[1].state !== 'kept').forEach((child) => {
          build(child, acc);
          if (_.has(child[1], 'children')) {
            acc.pop();
            acc.pop();
          }
        });
      }

      if (_.has(arr[1], 'state')) {
        if (depth === arr.length) acc.pop();
        switch (arr[1].state) {
          case 'changed':
            if (_.isPlainObject(arr[1].beforeValue)) {
              result.push(`${acc.join('')}' was updated. From [complex value] to `);
            } else if (arr[1].beforeValue === false || arr[1].beforeValue === true) {
              result.push(`${acc.join('')}' was updated. From ${arr[1].beforeValue} to `);
            } else result.push(`${acc.join('')}' was updated. From '${arr[1].beforeValue}' to `);
            if (_.isPlainObject(arr[1].afterValue)) {
              result.push('[complex value]\n');
            } else if (arr[1].afterValue === false || arr[1].afterValue === true) {
              result.push(`${arr[1].afterValue}\n`);
            } else result.push(`'${arr[1].afterValue}'\n`);
            acc.pop();
            break;
          case 'removed':
            result.push(`${acc.join('')}' was removed\n`);
            acc.pop();
            break;
          case 'added':
            if (_.isPlainObject(arr[1].afterValue)) {
              result.push(`${acc.join('')}' was added with value: [complex value]\n`);
            } else if (arr[1].afterValue === false || arr[1].afterValue === true) {
              result.push(`${acc.join('')}' was added with value: ${arr[1].afterValue}\n`);
            } else result.push(`${acc.join('')}' was added with value: '${arr[1].afterValue}'\n`);
            acc.pop();
            break;
          default:
            break;
        }
      }
    } else {
      result.push(`${arr}`);
    }
    return result;
  };
  _.toPairs(ast).sort().forEach((arr) => {
    const acc = ["Property '"];
    build(arr, acc, 0);
  });
  return result.flat().join('').trimEnd();
};

import _ from 'lodash';

export default (ast) => {
  const result = ['{\n'];
  const build = (arr, depth = 4) => {
    if (Array.isArray(arr)) {
      const childDepth = depth;
      if (_.has(arr[1], 'children')) {
        result.push(`${' '.repeat(childDepth)}${arr[0]}: {\n`);
        _.toPairs(arr[1].children).sort().forEach((child) => {
          build(child, childDepth + 4);
        });
        result.push(`${' '.repeat(childDepth)}}\n`);
      }
      if (!_.has(arr[1], 'state') && !_.has(arr[1], 'children')) {
        if (!_.isPlainObject(arr[1])) {
          result.push(`${arr[0]}: ${arr[1]}\n`);
        }
        if (_.isPlainObject(arr[1])) {
          if (childDepth < 12) {
            result.push(`${' '.repeat(childDepth)}${arr[0]}: {\n${' '.repeat(childDepth + 4)}`);
          } else {
            result.push(`${' '.repeat(childDepth - 12)}${arr[0]}: {\n${' '.repeat(childDepth + 4)}`);
          }
          _.toPairs(arr[1]).sort().forEach((child) => {
            build(child, childDepth + 4);
          });
          result.push(`${' '.repeat(childDepth)}}\n`);
        }
      }
      if (_.has(arr[1], 'state')) {
        switch (arr[1].state) {
          case 'changed':
            if (_.isPlainObject(arr[1].beforeValue)) {
              result.push(`${' '.repeat(childDepth - 2)}- ${arr[0]}: {\n${' '.repeat(childDepth + 4)}`);
              build(_.toPairs(arr[1].beforeValue, childDepth).flat());
              result.push(`${' '.repeat(childDepth)}}\n`);
            } else {
              result.push(`${' '.repeat(childDepth - 2)}- ${arr[0]}: ${arr[1].beforeValue}`);
              result.push('\n');
            }
            if (_.isPlainObject(arr[1].afterValue)) {
              result.push(`${' '.repeat(childDepth - 2)}+ ${arr[0]}: {\n${' '.repeat(childDepth + 4)}`);
              build(_.toPairs(arr[1].afterValue, childDepth).flat());
              result.push(`${' '.repeat(childDepth)}}\n`);
            } else {
              result.push(`${' '.repeat(childDepth - 2)}+ ${arr[0]}: ${arr[1].afterValue}`);
              result.push('\n');
            }
            break;
          case 'removed':
            if (_.isPlainObject(arr[1].beforeValue)) {
              result.push(`${' '.repeat(childDepth - 2)}- ${arr[0]}: {\n${' '.repeat(childDepth + 4)}`);
              _.toPairs(arr[1].beforeValue).forEach((child) => build(child, childDepth + 4));
              result.push(`${' '.repeat(childDepth)}}\n`);
            } else {
              result.push(`${' '.repeat(childDepth - 2)}- ${arr[0]}: ${arr[1].beforeValue}`);
              result.push('\n');
            }
            break;
          case 'added':
            if (_.isPlainObject(arr[1].afterValue)) {
              result.push(`${' '.repeat(childDepth - 2)}+ ${arr[0]}: {\n${' '.repeat(childDepth + 4)}`);
              _.toPairs(arr[1].afterValue).forEach((child) => build(child, childDepth + 4));
              result.push(`${' '.repeat(childDepth)}}\n`);
            } else {
              result.push(`${' '.repeat(childDepth - 2)}+ ${arr[0]}: ${arr[1].afterValue}`);
              result.push('\n');
            }
            break;
          default:
            result.push(`${' '.repeat(childDepth)}${arr[0]}: `);
            build(arr[1].value);
            result.push('\n');
            break;
        }
      }
    } else {
      result.push(`${arr}`);
    }
    return result;
  };
  _.toPairs(ast).sort().forEach((arr) => build(arr, 4));
  result.push('}');
  return result.join('');
};

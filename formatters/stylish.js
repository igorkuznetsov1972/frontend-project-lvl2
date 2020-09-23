import _ from 'lodash';

export default (ast) => {
  const result = ['{\n'];
  const build = (arr, depth) => {
    const childDepth = depth;
    if (!Array.isArray(arr)) result.push(`${arr}`);
    else if (_.has(arr[1], 'children') && arr[1].type === 'unchanged') {
      result.push(`${' '.repeat(childDepth)}${arr[0]}: {\n`);
      (arr[1].children).sort().forEach((child) => {
        build(child, childDepth + 4);
      });
      result.push(`${' '.repeat(childDepth)}}\n`);
    } else if (_.has(arr[1], 'type')) {
      switch (arr[1].type) {
        case 'changed':
          if (_.isPlainObject(arr[1].beforeValue)) {
            result.push(`${' '.repeat(childDepth - 2)}- ${arr[0]}: {\n`);
            _.toPairs(arr[1].beforeValue).forEach((child) => build(child, childDepth + 4));
            result.push(`${' '.repeat(childDepth)}}\n`);
          } else {
            result.push(`${' '.repeat(childDepth - 2)}- ${arr[0]}: ${arr[1].beforeValue}`);
            result.push('\n');
          }
          if (_.isPlainObject(arr[1].afterValue)) {
            result.push(`${' '.repeat(childDepth - 2)}+ ${arr[0]}: {\n`);
            _.toPairs(arr[1].afterValue).forEach((child) => build(child, childDepth + 4));
            result.push(`${' '.repeat(childDepth)}}\n`);
          } else {
            result.push(`${' '.repeat(childDepth - 2)}+ ${arr[0]}: ${arr[1].afterValue}`);
            result.push('\n');
          }
          break;
        case 'removed':
          if (_.isPlainObject(arr[1].beforeValue)) {
            result.push(`${' '.repeat(childDepth - 2)}- ${arr[0]}: {\n`);
            _.toPairs(arr[1].beforeValue).forEach((child) => build(child, childDepth + 4));
            result.push(`${' '.repeat(childDepth)}}\n`);
          } else {
            result.push(`${' '.repeat(childDepth - 2)}- ${arr[0]}: ${arr[1].beforeValue}`);
            result.push('\n');
          }
          break;
        case 'added':
          if (_.isPlainObject(arr[1].afterValue)) {
            result.push(`${' '.repeat(childDepth - 2)}+ ${arr[0]}: {\n`);
            _.toPairs(arr[1].afterValue).forEach((child) => build(child, childDepth + 4));
            result.push(`${' '.repeat(childDepth)}}\n`);
          } else {
            result.push(`${' '.repeat(childDepth - 2)}+ ${arr[0]}: ${arr[1].afterValue}`);
            result.push('\n');
          }
          break;
        case 'unchanged':
          result.push(`${' '.repeat(childDepth)}${arr[0]}: `);
          build(arr[1].value, childDepth);
          result.push('\n');
          break;
        default:
          break;
      }
    } else if (!_.isPlainObject(arr[1])) {
      result.push(`${' '.repeat(childDepth)}${arr[0]}: ${arr[1]}\n`);
    } else if (_.isPlainObject(arr[1])) {
      result.push(`${' '.repeat(childDepth)}${arr[0]}: {\n`);
      _.toPairs(arr[1]).sort().forEach((child) => {
        build(child, childDepth + 4);
      });
      result.push(`${' '.repeat(childDepth)}}\n`);
    }
    return result;
  };
  ast.sort().forEach((arr) => build(arr, 4));
  result.push('}');
  return result.join('');
};

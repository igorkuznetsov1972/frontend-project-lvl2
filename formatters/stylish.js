import _ from 'lodash';

export default (ast) => {
  const result = ['{\n'];
  const build = (arr, depth) => {
    const buildRemovedString = (name, value, passedDepth) => {
      if (_.isPlainObject(value)) {
        result.push(`${' '.repeat(passedDepth - 2)}- ${name}: {\n`);
        _.toPairs(value).forEach((child) => build(child, depth + 4));
        result.push(`${' '.repeat(passedDepth)}}\n`);
      } else {
        result.push(`${' '.repeat(passedDepth - 2)}- ${name}: ${value}`);
        result.push('\n');
      }
    };
    const buildAddedString = (name, value, passedDepth) => {
      if (_.isPlainObject(value)) {
        result.push(`${' '.repeat(passedDepth - 2)}+ ${name}: {\n`);
        _.toPairs(value).forEach((child) => build(child, depth + 4));
        result.push(`${' '.repeat(passedDepth)}}\n`);
      } else {
        result.push(`${' '.repeat(passedDepth - 2)}+ ${name}: ${value}`);
        result.push('\n');
      }
    };
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
          buildRemovedString(arr[0], arr[1].beforeValue, childDepth);
          buildAddedString(arr[0], arr[1].afterValue, childDepth);
          break;
        case 'removed':
          buildRemovedString(arr[0], arr[1].beforeValue, childDepth);
          break;
        case 'added':
          buildAddedString(arr[0], arr[1].afterValue, childDepth);
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

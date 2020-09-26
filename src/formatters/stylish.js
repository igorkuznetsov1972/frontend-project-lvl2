import _ from 'lodash';

export default (ast) => {
  const result = ['{\n'];
  const build = (arr, depth) => {
    const buildRemovedString = (name, value, passedDepth) => {
      if (_.isArray(value) && value.length > 1) {
        result.push(`${' '.repeat(passedDepth - 2)}- ${name}: {\n`);
        value.forEach((child) => build(child, depth + 4));
        result.push(`${' '.repeat(passedDepth)}}\n`);
      } else if (_.isPlainObject(value[0])) {
        const pair = _.toPairs(value[0]).flat();
        result.push(`${' '.repeat(passedDepth - 2)}- ${name}: {\n`);
        result.push(`${' '.repeat(passedDepth + 3)} ${pair[0]}: ${pair[1]}\n${' '.repeat(passedDepth)}}\n`);
      } else if (_.isPlainObject(value)) {
        result.push(`${' '.repeat(passedDepth - 2)}- ${name}: {\n`);
        build(_.toPairs(value).flat(), depth + 4);
        result.push(`${' '.repeat(passedDepth)}}\n`);
      } else {
        result.push(`${' '.repeat(passedDepth - 2)}- ${name}: ${value}\n`);
      }
    };
    const buildAddedString = (name, value, passedDepth) => {
      if (_.isArray(value) && value.length > 1) {
        result.push(`${' '.repeat(passedDepth - 2)}+ ${name}: {\n`);
        value.forEach((child) => build(child, depth + 4));
        result.push(`${' '.repeat(passedDepth)}}\n`);
      } else if (_.isPlainObject(value[0])) {
        const pair = _.toPairs(value[0]).flat();
        result.push(`${' '.repeat(passedDepth - 2)}+ ${name}: {\n`);
        result.push(`${' '.repeat(passedDepth + 3)} ${pair[0]}: ${pair[1]}\n${' '.repeat(passedDepth)}}\n`);
      } else if (_.isPlainObject(value)) {
        result.push(`${' '.repeat(passedDepth - 2)}+ ${name}: {\n`);
        build(_.toPairs(value).flat(), depth + 4);
        result.push(`${' '.repeat(passedDepth)}}\n`);
      } else {
        result.push(`${' '.repeat(passedDepth - 2)}+ ${name}: ${value}\n`);
      }
    };
    const childDepth = depth;
    if (_.has(arr[1], 'type')) {
      switch (arr[1].type) {
        case 'nested':
          result.push(`${' '.repeat(childDepth)}${arr[0]}: {\n`);
          (arr[1].children).sort().forEach((child) => {
            build(child, childDepth + 4);
          });
          result.push(`${' '.repeat(childDepth)}}\n`);
          break;
        case 'child':
          result.push(`${' '.repeat(childDepth)}${arr[0]}: {\n`);
          (arr[1].value).forEach((child) => build(child, childDepth + 4));
          result.push(`${' '.repeat(childDepth)}}\n`);
          break;
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
          if (_.isPlainObject(arr[1].value)) {
            result.push(`${' '.repeat(childDepth)}${arr[0]}: `);
            build(arr[1].value, childDepth);
            result.push('\n');
          } else {
            result.push(`${' '.repeat(childDepth)}${arr[0]}: ${arr[1].value}\n`);
          }
          break;
        default:
          break;
      }
    } else if (_.isPlainObject(arr)) {
      _.toPairs(arr).forEach((child) => {
        build(child, childDepth);
      });
    } else if (!_.isPlainObject(arr[1])) {
      result.push(`${' '.repeat(childDepth)}${arr[0]}: ${arr[1]}\n`);
    } else if (_.isPlainObject(arr[1])) {
      result.push(`${' '.repeat(childDepth)}${arr[0]}: {\n`);
      _.toPairs(arr[1]).sort().forEach((child) => build(child, childDepth + 4));
      result.push(`${' '.repeat(childDepth)}}\n`);
    }
    return result;
  };
  ast.sort().forEach((arr) => build(arr, 4));
  result.push('}');
  return result.join('');
};

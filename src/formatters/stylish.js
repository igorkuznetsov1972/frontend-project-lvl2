import _ from 'lodash';

export default (ast) => {
  const result = ['{\n'];
  const build = (arr, depth) => {
    const buildString = (name, value, passedDepth, typeMarker = ' ') => {
      if (_.isArray(value)) {
        result.push(`${' '.repeat(passedDepth - 2)}${typeMarker} ${name}: {\n`);
        value.forEach((child) => build(child, depth + 4));
        result.push(`${' '.repeat(passedDepth)}}\n`);
      } else if (_.isPlainObject(value[0])) {
        const pair = _.toPairs(value[0]).flat();
        result.push(`${' '.repeat(passedDepth - 2)}${typeMarker} ${name}: {\n`);
        result.push(`${' '.repeat(passedDepth + 3)} ${pair[0]}: ${pair[1]}\n${' '.repeat(passedDepth)}}\n`);
      } else if (_.isPlainObject(value)) {
        result.push(`${' '.repeat(passedDepth - 2)}${typeMarker} ${name}: {\n`);
        build(_.toPairs(value).flat(), depth + 4);
        result.push(`${' '.repeat(passedDepth)}}\n`);
      } else {
        result.push(`${' '.repeat(passedDepth - 2)}${typeMarker} ${name}: ${value}\n`);
      }
    };
    const childDepth = depth;
    if (_.has(arr[1], 'type')) {
      switch (arr[1].type) {
        case 'nested':
          buildString(arr[0], arr[1].children, childDepth);
          break;
        case 'child':
          buildString(arr[0], arr[1].value, childDepth);
          break;
        case 'changed':
          buildString(arr[0], arr[1].beforeValue, childDepth, '-');
          buildString(arr[0], arr[1].afterValue, childDepth, '+');
          break;
        case 'unchanged':
          buildString(arr[0], arr[1].value, childDepth);
          break;
        case 'added':
          buildString(arr[0], arr[1].afterValue, childDepth, '+');
          break;
        case 'removed':
          buildString(arr[0], arr[1].beforeValue, childDepth, '-');
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
    }
    return result;
  };
  ast.forEach((arr) => build(arr, 4));
  result.push('}');
  return result.join('');
};

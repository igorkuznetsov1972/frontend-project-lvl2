import _ from 'lodash';

export default (ast, childIndentation = 4, typeMarkerIndentation = 2) => {
  const result = ['{\n'];
  const build = (arr, depth) => {
    const buildString = (name, value, passedDepth, typeMarker = ' ') => {
      const buildParamName = () => result.push(`${' '.repeat(passedDepth - typeMarkerIndentation)}${typeMarker} ${name}: {\n`);
      const closingCurlyBrace = () => result.push(`${' '.repeat(passedDepth)}}\n`);
      if (_.isArray(value)) {
        buildParamName();
        _.forEach(value, (child) => build(child, depth + childIndentation));
        closingCurlyBrace();
      } else if (_.isPlainObject(value[0])) {
        const pair = _.toPairs(value[0]).flat();
        buildParamName();
        result.push(`${' '.repeat(passedDepth + childIndentation)}${pair[0]}: ${pair[1]}\n`);
        closingCurlyBrace();
      } else if (_.isPlainObject(value)) {
        buildParamName();
        _.forEach(_.toPairs(value), (child) => build(child, depth + childIndentation));
        closingCurlyBrace();
      } else {
        result.push(`${' '.repeat(passedDepth - typeMarkerIndentation)}${typeMarker} ${name}: ${value}\n`);
      }
    };
    const childDepth = depth;
    if (_.has(arr[1], 'type')) {
      switch (arr[1].type) {
        case 'nested':
          buildString(arr[0], arr[1].children, childDepth);
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
      _.forEach(_.toPairs(arr), (child) => {
        build(child, childDepth);
      });
    } else if (!_.isPlainObject(arr[1])) {
      result.push(`${' '.repeat(childDepth)}${arr[0]}: ${arr[1]}\n`);
    } else if (_.isPlainObject(arr[1])) {
      result.push(`${' '.repeat(childDepth)}${arr[0]}: {\n`);
      _.forEach(_.toPairs(arr[1]), (child) => build(child, childDepth + 4));
      result.push(`${' '.repeat(childDepth)}}\n`);
    }
    return result;
  };
  _.forEach(ast, (arr) => build(arr, childIndentation));
  result.push('}');
  return result.join('');
};

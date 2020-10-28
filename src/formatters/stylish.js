import _ from 'lodash';

export default (ast) => {
  const buildStylishDiff = (arr, depth) => arr.map((node) => {
    const {
      name, value, children, type, beforeValue, afterValue,
    } = node;
    const buildIndentation = (passedDepth) => `${' '.repeat(passedDepth)}`;
    const buildString = (paramValue, passedDepth) => {
      const closingCurlyBrace = `${buildIndentation(passedDepth)}}`;
      if (_.isPlainObject(paramValue)) {
        return _.flattenDeep(['{', Object.entries(paramValue).map(([key, nestedValue]) => [`${buildIndentation(passedDepth + 4)}${key}: ${buildString(nestedValue, passedDepth + 4)}`]), `${closingCurlyBrace}`]).join('\n');
      } return `${paramValue}`;
    };

    switch (type) {
      case 'nested':
        return [`${buildIndentation(depth)}${name}: {`, buildStylishDiff(children, depth + 4), `${' '.repeat(depth)}}`];
      case 'changed':
        return [`${buildIndentation(depth - 2)}- ${name}: ${buildString(beforeValue, depth)}`, `${buildIndentation(depth - 2)}+ ${name}: ${buildString(afterValue, depth)}`];
      case 'unchanged':
        return `${buildIndentation(depth)}${name}: ${buildString(value, depth)}`;
      case 'added':
        return `${buildIndentation(depth - 2)}+ ${name}: ${buildString(afterValue, depth)}`;
      case 'removed':
        return `${buildIndentation(depth - 2)}- ${name}: ${buildString(beforeValue, depth)}`;
      default:
        return new Error(`${type} is not a valid node type`);
    }
  });
  console.log(buildStylishDiff(ast, 4));
  return `{\n${_.flattenDeep(buildStylishDiff(ast, 4)).join('\n')}\n}`;
};

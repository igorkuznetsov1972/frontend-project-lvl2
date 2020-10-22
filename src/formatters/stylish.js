import _ from 'lodash';

export default (ast) => {
  const buildStylishOutput = (arr, depth) => arr.flatMap((node) => {
    const {
      name, value, children, type, beforeValue, afterValue,
    } = node;
    const buildIndentation = (passedDepth) => `${' '.repeat(passedDepth)}`;
    const buildString = (paramValue, passedDepth) => {
      const closingCurlyBrace = `${buildIndentation(passedDepth)}}\n`;
      if (_.isPlainObject(paramValue)) {
        return `{\n${Object.entries(paramValue).flatMap(([key, nestedValue]) => `${buildIndentation(passedDepth + 4)}${key}: ${buildString(nestedValue, passedDepth + 4)}`).join('')}${closingCurlyBrace}`;
      } return `${paramValue}\n`;
    };

    switch (type) {
      case 'nested':
        return `${buildIndentation(depth)}${name}: {\n${buildStylishOutput(children, depth + 4).join('')}${' '.repeat(depth)}}\n`;
      case 'changed':
        return `${buildIndentation(depth - 2)}- ${name}: ${buildString(beforeValue, depth)}${buildIndentation(depth - 2)}+ ${name}: ${buildString(afterValue, depth)}`;
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
  return `{\n${buildStylishOutput(ast, 4).join('').trimEnd()}\n}`;
};

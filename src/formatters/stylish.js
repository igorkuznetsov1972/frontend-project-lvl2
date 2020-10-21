import _ from 'lodash';

export default (ast, childIndentation = 4, typeMarkerIndentation = 2) => {
  const buildStylishOutput = (arr, depth) => arr.flatMap((node) => {
    const {
      name, value, children, type, beforeValue, afterValue,
    } = node;

    const buildString = (paramName, paramValue, passedDepth, typeMarker = ' ') => {
      const buildParamName = `${' '.repeat(passedDepth - typeMarkerIndentation)}${typeMarker} ${paramName}: {\n`;
      const closingCurlyBrace = `${' '.repeat(passedDepth)}}\n`;
      if (_.isPlainObject(paramValue)) {
        return `${buildParamName}${Object.entries(paramValue).flatMap(([key, nestedValue]) => buildString(key, nestedValue, passedDepth + childIndentation)).join('')}${closingCurlyBrace}`;
      } return `${' '.repeat(passedDepth - typeMarkerIndentation)}${typeMarker} ${paramName}: ${paramValue}\n`;
    };

    switch (type) {
      case 'nested':
        return `${' '.repeat(depth)}${name}: {\n${buildStylishOutput(children, depth + childIndentation).join('')}${' '.repeat(depth)}}\n`;
      case 'changed':
        return `${buildString(name, beforeValue, depth, '-')}${buildString(name, afterValue, depth, '+')}`;
      case 'unchanged':
        return `${buildString(name, value, depth)}`;
      case 'added':
        return `${buildString(name, afterValue, depth, '+')}`;
      case 'removed':
        return `${buildString(name, beforeValue, depth, '-')}`;
      default:
        return new Error(`${type} is not a valid node type`);
    }
  });
  return `{\n${buildStylishOutput(ast, childIndentation).join('').trimEnd()}\n}`;
};

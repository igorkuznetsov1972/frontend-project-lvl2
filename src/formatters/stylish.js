import _ from 'lodash';

export default (ast) => {
  const stringify = (arr, depth) => arr.map((node) => {
    const indent = 4;
    const {
      name, value, children, type, beforeValue, afterValue,
    } = node;
    const buildIndentation = (passedDepth) => `${' '.repeat(indent * passedDepth)}`;
    const buildIndentationForChangedValues = (passedDepth) => `${' '.repeat((indent * passedDepth) - 2)}`;
    const buildString = (paramValue, passedDepth) => {
      const closingCurlyBrace = `${buildIndentation(passedDepth)}}`;
      if (_.isPlainObject(paramValue)) {
        return _.flattenDeep(['{', Object.entries(paramValue).map(([key, nestedValue]) => [`${buildIndentation(passedDepth + 1)}${key}: ${buildString(nestedValue, passedDepth + 1)}`]), `${closingCurlyBrace}`]).join('\n');
      } return paramValue;
    };

    switch (type) {
      case 'nested':
        return [`${buildIndentation(depth)}${name}: {`, stringify(children, depth + 1), `${buildIndentation(depth)}}`];
      case 'changed':
        return [`${buildIndentationForChangedValues(depth)}- ${name}: ${buildString(beforeValue, depth)}`, `${buildIndentationForChangedValues(depth)}+ ${name}: ${buildString(afterValue, depth)}`];
      case 'unchanged':
        return `${buildIndentation(depth)}${name}: ${buildString(value, depth)}`;
      case 'added':
        return `${buildIndentationForChangedValues(depth)}+ ${name}: ${buildString(afterValue, depth)}`;
      case 'removed':
        return `${buildIndentationForChangedValues(depth)}- ${name}: ${buildString(beforeValue, depth)}`;
      default:
        return new Error(`${type} is not a valid node type`);
    }
  });

  return `{\n${_.flattenDeep(stringify(ast, 1)).join('\n')}\n}`;
};

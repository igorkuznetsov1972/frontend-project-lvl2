import _ from 'lodash';

export default (ast, childIndentation = 4, typeMarkerIndentation = 2) => {
  const result = ['{\n'];
  const buildStylishOutput = (node, depth) => {
    const buildString = (name, value, passedDepth, typeMarker = ' ') => {
      const buildParamName = () => result.push(`${' '.repeat(passedDepth - typeMarkerIndentation)}${typeMarker} ${name}: {\n`);
      const closingCurlyBrace = () => result.push(`${' '.repeat(passedDepth)}}\n`);
      if (_.isArray(value)) {
        buildParamName();
        _.forEach(value, (child) => buildStylishOutput(child, passedDepth + childIndentation));
        closingCurlyBrace();
      } else if (_.isPlainObject(value)) {
        buildParamName();
        _.forEach(_.toPairs(value), (child) => {
          buildStylishOutput(child, passedDepth + childIndentation);
        });
        closingCurlyBrace();
      } else {
        result.push(`${' '.repeat(passedDepth - typeMarkerIndentation)}${typeMarker} ${name}: ${value}\n`);
      }
    };
    const childDepth = depth;
    if (_.has(node, 'type')) {
      switch (node.type) {
        case 'nested':
          buildString(node.name, node.children, childDepth);
          break;
        case 'changed':
          buildString(node.name, node.beforeValue, childDepth, '-');
          buildString(node.name, node.afterValue, childDepth, '+');
          break;
        case 'unchanged':
          buildString(node.name, node.value, childDepth);
          break;
        case 'added':
          buildString(node.name, node.afterValue, childDepth, '+');
          break;
        case 'removed':
          buildString(node.name, node.beforeValue, childDepth, '-');
          break;
        default:
          break;
      }
    } else if (_.isPlainObject(node)) {
      _.forEach(_.toPairs(node), (child) => {
        buildString(child[0], child[1], childDepth);
      });
    } else if (!_.isPlainObject(node[1])) {
      buildString(node[0], node[1], childDepth);
    } else if (_.isPlainObject(node[1])) {
      result.push(`${' '.repeat(childDepth)}${node[0]}: {\n`);
      _.forEach(_.toPairs(node[1]), (child) => {
        buildString(child[0], child[1], childDepth + childIndentation);
      });
      result.push(`${' '.repeat(childDepth)}}\n`);
    }
    return result;
  };
  _.forEach(ast, (obj) => buildStylishOutput(obj, childIndentation));
  result.push('}');
  return result.join('');
};

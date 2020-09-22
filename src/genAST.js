import _ from 'lodash';

const genAST = (fileContent1, fileContent2) => {
  const ast = {};
  const uniqueKeys = _.union(_.keys(fileContent1), _.keys(fileContent2));
  uniqueKeys.forEach((key) => {
    if (!_.has(fileContent1, key)) {
      ast[key] = { modificationType: 'added', afterValue: fileContent2[key] };
    } else if (!_.has(fileContent2, key)) {
      ast[key] = { modificationType: 'removed', beforeValue: fileContent1[key] };
    } else if (_.isEqual(fileContent1[key], fileContent2[key])) {
      ast[key] = { modificationType: 'kept', value: fileContent1[key] };
    } else if (_.isPlainObject(fileContent1[key]) && _.isPlainObject(fileContent2[key])) {
      ast[key] = { children: (genAST(fileContent1[key], fileContent2[key])) };
    } else if (!_.isEqual(fileContent1[key], fileContent2[key])) {
      ast[key] = { modificationType: 'changed', beforeValue: fileContent1[key], afterValue: fileContent2[key] };
    }
  });
  return ast;
};
export default genAST;

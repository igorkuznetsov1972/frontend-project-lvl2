import _ from 'lodash';

const genAST = (fileContent1, fileContent2) => {
  const uniqueKeys = _.union(_.keys(fileContent1), _.keys(fileContent2));
  const ast = uniqueKeys.map((key) => {
    if (!_.has(fileContent1, key)) {
      return [key, { type: 'added', afterValue: fileContent2[key] }];
    } if (!_.has(fileContent2, key)) {
      return [key, { type: 'removed', beforeValue: fileContent1[key] }];
    } if (_.isEqual(fileContent1[key], fileContent2[key])) {
      return [key, { type: 'unchanged', value: fileContent1[key] }];
    } if (_.isPlainObject(fileContent1[key]) && _.isPlainObject(fileContent2[key])) {
      return [key, { type: 'unchanged', children: (genAST(fileContent1[key], fileContent2[key])) }];
    } if (!_.isEqual(fileContent1[key], fileContent2[key])) {
      return [key, { type: 'changed', beforeValue: fileContent1[key], afterValue: fileContent2[key] }];
    }
    return ['wrong type'];
  });
  return ast;
};
export default genAST;

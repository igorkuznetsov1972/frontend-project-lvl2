import _ from 'lodash';

const genAST = (fileContent1, fileContent2) => {
  const result = {};
  const uniqueKeys = _.union(_.keys(fileContent1), _.keys(fileContent2));
  uniqueKeys.forEach((key) => {
    if (!_.has(fileContent1, key)) {
      result[key] = { modificationType: 'added', afterValue: fileContent2[key] };
    } else if (!_.has(fileContent2, key)) {
      result[key] = { modificationType: 'removed', beforeValue: fileContent1[key] };
    } else if (_.isEqual(fileContent1[key], fileContent2[key])) {
      result[key] = { modificationType: 'kept', value: fileContent1[key] };
    } else if (_.isPlainObject(fileContent1[key]) && _.isPlainObject(fileContent2[key])) {
      result[key] = { children: (genAST(fileContent1[key], fileContent2[key])) };
    } else if (!_.isEqual(fileContent1[key], fileContent2[key])) {
      result[key] = { modificationType: 'changed', beforeValue: fileContent1[key], afterValue: fileContent2[key] };
    }
  });
  return result;
};
export default genAST;

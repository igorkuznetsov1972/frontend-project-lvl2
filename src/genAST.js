import _ from 'lodash';

const genAST = (fileContent1, fileContent2) => {
  const result = {};
  const uniqueKeys = _.union(Object.keys(fileContent1), Object.keys(fileContent2));
  uniqueKeys.forEach((key) => {
    if (_.has(fileContent1, key) && !_.has(fileContent2, key)) {
      result[key] = { state: 'removed', beforeValue: fileContent1[key] };
    }
    if (_.has(fileContent1, key) && !_.isPlainObject(fileContent1[key])) {
      if (_.isEqual(fileContent1[key], fileContent2[key])) {
        result[key] = { state: 'kept', value: fileContent1[key] };
      }
      if (_.has(fileContent1, key) && _.has(fileContent2, key)
      && !_.isEqual(fileContent1[key], fileContent2[key])) {
        result[key] = { state: 'changed', beforeValue: fileContent1[key], afterValue: fileContent2[key] };
      }
    }
    if (_.isPlainObject(fileContent1[key]) && _.has(fileContent2, key)
    && !_.isPlainObject(fileContent2[key])) {
      result[key] = { state: 'changed', beforeValue: fileContent1[key], afterValue: fileContent2[key] };
    }
    if (_.isPlainObject(fileContent1[key]) && _.isPlainObject(fileContent2[key])) {
      result[key] = { children: (genAST(fileContent1[key], fileContent2[key])) };
    }
    if (_.has(fileContent2, key) && !_.has(fileContent1, key)) {
      result[key] = { state: 'added', afterValue: fileContent2[key] };
    }
  });
  return result;
};
export default genAST;

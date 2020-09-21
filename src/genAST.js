import _ from 'lodash';

const genAST = (fileContent2leContent1, fileContent2) => {
  const result = {};
  Object.keys(fileContent2leContent1).forEach((key) => {
    if (!_.has(fileContent2, key)) {
      result[key] = { state: 'removed', beforeValue: fileContent2leContent1[key] };
    }
    if (!_.isPlainObject(fileContent2leContent1[key])) {
      if (_.isEqual(fileContent2leContent1[key], fileContent2[key])) {
        result[key] = { state: 'kept', value: fileContent2leContent1[key] };
      }
      if (_.has(fileContent2, key) && !_.isEqual(fileContent2leContent1[key], fileContent2[key])) {
        result[key] = { state: 'changed', beforeValue: fileContent2leContent1[key], afterValue: fileContent2[key] };
      }
    }
    if (_.isPlainObject(fileContent2leContent1[key]) && _.has(fileContent2, key) && !_.isPlainObject(fileContent2[key])) {
      result[key] = { state: 'changed', beforeValue: fileContent2leContent1[key], afterValue: fileContent2[key] };
    }
    if (_.isPlainObject(fileContent2leContent1[key]) && _.isPlainObject(fileContent2[key])) {
      result[key] = { children: (genAST(fileContent2leContent1[key], fileContent2[key])) };
    }
  });
  Object.keys(fileContent2).forEach((key) => {
    if (!_.has(fileContent2leContent1, key)) {
      result[key] = { state: 'added', afterValue: fileContent2[key] };
    }
  });
  return result;
};
export default genAST;

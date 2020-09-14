import _ from 'lodash';

const genAST = (file1, file2) => {
  const result = {};
  Object.keys(file1).forEach((key) => {
    if (!_.has(file2, key)) {
      result[key] = { status: 'removed', beforeValue: file1[key] };
    }
    if (!_.isPlainObject(file1[key])) {
      if (_.isEqual(file1[key], file2[key])) {
        result[key] = { status: 'kept', value: file1[key] };
      }
      if (_.has(file2, key) && !_.isEqual(file1[key], file2[key])) {
        result[key] = { status: 'changed', beforeValue: file1[key], afterValue: file2[key] };
      }
    }
    if (_.isPlainObject(file1[key]) && _.has(file2, key) && !_.isPlainObject(file2[key])) {
      result[key] = { status: 'changed', beforeValue: file1[key], afterValue: file2[key] };
    }
    if (_.isPlainObject(file1[key]) && _.isPlainObject(file2[key])) {
      result[key] = { children: (genAST(file1[key], file2[key])) };
    }
  });
  Object.keys(file2).forEach((key) => {
    if (!_.has(file1, key)) {
      result[key] = { status: 'added', afterValue: file2[key] };
    }
  });
  return result;
};
export default genAST;

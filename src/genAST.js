import fs from 'fs';
import _ from 'lodash';

const addChildObject = (obj) => {
  if (_.isPlainObject(obj)) {
    return _.keys(obj).map((key1) => {
      if (_.isPlainObject(obj[key1])) return [key1, { type: 'child', value: (addChildObject(obj[key1])) }];
      return { [key1]: obj[key1] };
    });
  }
  return obj;
};
const genAST = (fileContent1, fileContent2) => {
  const uniqueKeys = _.union(_.keys(fileContent1), _.keys(fileContent2)).sort();
  const ast = uniqueKeys.map((key) => {
    if (!_.has(fileContent1, key)) {
      return [key, { type: 'added', afterValue: addChildObject(fileContent2[key]) }];
    } if (!_.has(fileContent2, key)) {
      return [key, { type: 'removed', beforeValue: addChildObject(fileContent1[key]) }];
    } if (_.isEqual(fileContent1[key], fileContent2[key])) {
      return [key, { type: 'unchanged', value: fileContent1[key] }];
    } if (_.isPlainObject(fileContent1[key]) && _.isPlainObject(fileContent2[key])) {
      return [key, { type: 'nested', children: (genAST(fileContent1[key], fileContent2[key])) }];
    } return [key, { type: 'changed', beforeValue: addChildObject(fileContent1[key]), afterValue: addChildObject(fileContent2[key]) }];
  });
  fs.writeFileSync('result1.json', JSON.stringify(ast));
  return ast;
};
export default genAST;

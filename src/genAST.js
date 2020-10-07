import _ from 'lodash';

const genAST = (obj1, obj2) => {
  const uniqueKeys = _.union(_.keys(obj1), _.keys(obj2));
  const sortedUniqueKeys = _.sortBy(uniqueKeys);
  const ast = sortedUniqueKeys.map((key) => {
    if (!_.has(obj1, key)) {
      return { name: key, type: 'added', afterValue: obj2[key] };
    } if (!_.has(obj2, key)) {
      return { name: key, type: 'removed', beforeValue: obj1[key] };
    } if (_.isPlainObject(obj1[key]) && _.isPlainObject(obj2[key])) {
      return { name: key, type: 'nested', children: (genAST(obj1[key], obj2[key])) };
    } if (!_.isEqual(obj1[key], obj2[key])) {
      return {
        name: key, type: 'changed', beforeValue: obj1[key], afterValue: obj2[key],
      };
    } return { name: key, type: 'unchanged', value: obj1[key] };
  });
  return ast;
};
export default genAST;

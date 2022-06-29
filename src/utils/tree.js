/**
 * 树转成列表
 * @returns
 */
export function treeToList(items, data = [], key = 'children') {
  for (const item of items) {
    data.push(item);
    if (item[key] && item[key].length > 0) {
      treeToList(item[key], data, key);
    }
  }
  return data;
}

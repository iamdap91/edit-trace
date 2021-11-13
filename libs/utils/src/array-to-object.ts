export function ArrayToObject<T>(array: T[], columns: string[]) {
  const obj = {};
  for (let i = 0; i < columns.length; i++) {
    obj[columns[i]] = array[i];
  }
  return obj;
}

interface ParsedObjectInterface {
  [key: string]: unknown;
}

export function ArrayToObject<T>(array: T[], columns: string[]): ParsedObjectInterface {
  const obj: ParsedObjectInterface = {};
  for (let i = 0; i < columns.length; i++) {
    obj[columns[i]] = array[i];
  }
  return obj;
}

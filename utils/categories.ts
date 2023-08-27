import { Categories } from "../store";

export function flattenCategories(
  categories: Categories,
  prefix: string = "",
  result: Categories = {},
  separator: string = ".",
): Categories {
  for (const key in categories) {
    if (categories.hasOwnProperty(key)) {
      const newKey = prefix !== "" ? `${prefix}${separator}${key}` : key;
      const nested = categories[key];
      if (nested !== null) {
        result[newKey] = null;
        flattenCategories(nested, newKey, result, separator);
      } else {
        result[newKey] = categories[key];
      }
    }
  }
  return result;
}

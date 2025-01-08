import _ from 'lodash';

export const removeKeys = (
  obj: Record<string, any>,
  keys: string[] = ['created_at', 'updated_at']
): Record<string, any> => {
  if (!_.isObject(obj) || _.isArray(obj)) {
    return obj; // Return value directly if not an object or is an array
  }

  return _.reduce(
    obj,
    (result, value, key) => {
      if (!keys.includes(key)) {
        result[key] =
          _.isObject(value) && !_.isArray(value)
            ? removeKeys(value, keys) // Recursively call for nested objects
            : value;
      }
      return result;
    },
    {} as Record<string, any>
  );
};

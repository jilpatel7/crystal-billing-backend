import _ from 'lodash';

export const removeKeys = (obj: Record<string, any>, keys: string[] = ["created_at", "updated_at"]): Record<string, any> => {
  return _.mapValues(obj, (value) => {
    if (_.isObject(value)) {
      if (_.isEmpty(value)) {
        return undefined;
      }
      return removeKeys(value, keys);
    }
    return value;
  });
};

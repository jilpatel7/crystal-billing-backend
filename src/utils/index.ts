import _ from 'lodash';

/**
 * Normalizes list/pagination params coming from the frontend table.
 * The TanstackTable posts: { limit, offset, columnToOrder, orderBy, search, ... }
 * while some older callers use { page, limit, sort, order }. This supports both.
 */
export const getListParams = (source: Record<string, any> = {}) => {
  const limit = Math.max(1, +(source.limit ?? 10) || 10);

  // Prefer explicit offset; otherwise derive it from page (1-based).
  const offset =
    source.offset !== undefined && source.offset !== null
      ? Math.max(0, +source.offset || 0)
      : (Math.max(1, +(source.page ?? 1) || 1) - 1) * limit;

  const sort = (source.columnToOrder || source.sort || 'id') as string;
  const order = String(source.orderBy || source.order || 'DESC').toUpperCase() === 'ASC'
    ? 'ASC'
    : 'DESC';

  const search = (source.search ?? '') as string;
  const page = Math.floor(offset / limit) + 1;

  return { limit, offset, sort, order: order as 'ASC' | 'DESC', search, page };
};

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

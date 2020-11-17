/** Used to generate unique IDs. */
const idCounter: Record<string, number> = {};

/**
 * Generates a unique ID. If `prefix` is given, the ID is appended to it.
 * @param {string} [prefix=''] The value to prefix the ID with.
 * @returns {string} Returns the unique ID.
 * @see random
 * @example
 *
 * uniqueId('contact_')
 * // => 'contact_104'
 *
 * uniqueId()
 * // => '105'
 */
export const uniqueId = (prefix = '$controller$') => {
  if (!idCounter[prefix]) {
    idCounter[prefix] = 0;
  }

  const id = ++idCounter[prefix];
  if (prefix === '$controller$') {
    return `${id}`;
  }

  return `${prefix}${id}`;
};


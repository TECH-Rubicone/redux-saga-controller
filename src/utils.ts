
// Used to generate unique IDs.
const counter: Record<string, number> = {};

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
export const uniqueId = (prefix = 'controller_') => {
  if (!counter[prefix]) {
    counter[prefix] = 0;
  }
  const id = ++counter[prefix];
  return prefix === 'controller_' ? `${id}` : `${prefix}${id}`;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isGeneratorFunction = (fn: any) => {
  // FIXME on production build the generator will compile to "switch function"
  return typeof fn === 'function';
  // FIXME it means the validation is "isGeneratorFunction" should be simplified too
  // return typeof fn === 'function' && fn.constructor && fn.constructor.name === 'GeneratorFunction';
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isString = (value: any) => typeof value === 'string';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isBoolean = (value: any) => typeof value === 'boolean';

export const isArray = Array.isArray;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isObject = (value: any) => {
  const type = typeof value;
  return value != null && (type === 'object' || type === 'function');
};

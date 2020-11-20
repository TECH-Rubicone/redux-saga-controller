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
export declare const uniqueId: (prefix?: string) => string;

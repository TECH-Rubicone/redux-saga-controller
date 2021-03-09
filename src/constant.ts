
// local dependencies
export const REDUCER_PATH = 'controller';

export const SAGA_PREFIX = '@CSD-action/';
export const REDUCER_PREFIX = '@CSD-store';

// NOTE to provide ability to know who call the method :)
export const SECRET = Symbol('key');

// NOTE lets fuck TS using bloody hack :)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function forceCast<T> (any: any): T { return any; }

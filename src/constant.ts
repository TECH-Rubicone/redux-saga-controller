
// local dependencies
import { hash } from './_';

export const SAGA_PREFIX = '@CSD-action/';
export const REDUCER_PATH = 'controller';
export const REDUCER_PREFIX = '@CSD-store';

// NOTE to provide ability to know who call the method :)
export const SECRET = Symbol(hash());

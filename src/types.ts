// NOTE -

import { Action } from './interfaces';

export type DefaultActions = 'updateCtrl' | 'clearCtrl'

// TODO
// export type ActionCreator = <T>(payload?: T) => Action<T>;
export type ActionCreator = (payload?: any) => Action;

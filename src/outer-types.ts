
// local dependencies
import { Action } from './actions';

export { Action };
export { State } from './reducer';
export { Subscriber } from './saga';
export { Controller } from './prepare';
/**************************************
 *              TYPING
 **************************************/

export interface ActionCreator<Payload> {
  (payload?: Payload): Action<Payload>
  toString(): string;
  TYPE: string;
}

export interface ActionCreators<Initial> {
  updateCtrl: ActionCreator<Partial<Initial>>;
  clearCtrl: ActionCreator<undefined>;
  /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
  [key: string]: ActionCreator<any>;
}

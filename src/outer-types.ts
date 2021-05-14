
import { Action } from './actions';

/**************************************
 *              TYPING
 **************************************/

export { Action };

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

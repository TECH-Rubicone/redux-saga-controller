
// outsource dependencies
import { ActionCreator, AnyAction } from 'redux';

// local dependencies
import { uniqueId } from './utils';
import { selectCSD, updateCSD, clearCSD } from './reducer';

interface Generator<T = unknown, TReturn = any, TNext = unknown>
  extends Iterator<T, TReturn, TNext> {
  next(...args: [] | [TNext]): IteratorResult<T, TReturn>;
  return(value: TReturn): IteratorResult<T, TReturn>;
  throw(e: any): IteratorResult<T, TReturn>;
  [Symbol.iterator](): Generator<T, TReturn, TNext>;
}

export type DefaultActions = 'updateCtrl' | 'clearCtrl'

export class Controller<T extends string, I> {
  initial: I;

  name: string;

  private _channel: any | null = null;

  TYPE = {} as Record<T, string>;

  selector: (name: string) => any;

  subscriber: any; // TODO type Generator<ForkEffect<never>, void, unknown>

  action = {} as Record<T | DefaultActions, ActionCreator<AnyAction>>;

  constructor ({ types, prefix, initial, subscriber } : {
    initial: I,
    prefix?: string,
    subscriber: any,
    types: Array<T>,
  }) {
    this.name = uniqueId(prefix);
    this.initial = initial;
    this.subscriber = subscriber;
    // TODO forbid to pass properties
    this.action.clearCtrl = clearCSD(this.name);
    // TODO allow to pass only properties as in initial
    this.action.updateCtrl = updateCSD(this.name);
    // NOTE prepare types and actions
    for (const type of types) {
      this.TYPE[type] = `TEST/${type.toUpperCase()}`;
      this.action[type] = (payload?: any) => ({ type, payload });
    }

    this.selector = selectCSD(this.name);
  }

  set channel (channel: any | null) {
    if (channel && this._channel) {
      console.error(`%c DUPLICATION ${this.name} `, 'color: #FF6766; font-weight: bolder; font-size: 18px;'
        , '\n Please make sure you use only one instance of Controller within DOM in same time'
        , '\n CACHE:', this
      );
    }
    this._channel = channel;
  }

  get channel () {
    return this._channel;
  }
}

export const c = new Controller({
  types: ['initialize', 'updateData', 'TYPE_2'],
  prefix: 'custom',
  initial: { test: 1, foo: 2, bar: 3 },
  subscriber: () => null
});

// console.log(c.action.updateData);


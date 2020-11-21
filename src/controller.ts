
// outsource dependencies
import { ActionCreator, AnyAction } from 'redux';

// local dependencies
import { uniqueId } from './utils';
import { selectCSD, updateCSD, clearCSD, State } from './reducer';

interface Generator<T = unknown, TReturn = any, TNext = unknown>
  extends Iterator<T, TReturn, TNext> {
  next(...args: [] | [TNext]): IteratorResult<T, TReturn>;
  return(value: TReturn): IteratorResult<T, TReturn>;
  throw(e: any): IteratorResult<T, TReturn>;
  [Symbol.iterator](): Generator<T, TReturn, TNext>;
}

export type DefaultActions = 'updateCtrl' | 'clearCtrl'

export class Controller<T extends string, I> {
  initial = {} as I;

  name: string;

  TYPE = {} as Record<T, string>;

  selector: (state: Record<string, Record<string, State<I>>>) => State<unknown>;

  subscriber: any; // TODO type Generator<ForkEffect<never>, void, unknown>

  action = {} as Record<T | DefaultActions, ActionCreator<AnyAction>>;

  private _channel: any | null = null;

  DEBUG: boolean;

  constructor ({ types = [], prefix, initial, subscriber, DEBUG = false } : {
    initial: I,
    DEBUG?: boolean,
    prefix?: string,
    subscriber: any,
    types: Array<T>,
  }) {
    // TODO Add validation for all properties
    this.DEBUG = DEBUG;
    this.name = uniqueId(prefix);
    this.initial = initial;
    this.subscriber = subscriber;
    // TODO forbid to pass properties
    this.action.clearCtrl = clearCSD(this.name);
    // TODO allow to pass only properties as in initial
    this.action.updateCtrl = updateCSD<I>(this.name);
    // NOTE prepare types and actions
    for (const type of types) {
      this.TYPE[type] = `${this.name}/${type.toUpperCase()}`;
      this.action[type] = (payload?: unknown) => ({ type: this.TYPE[type], payload });
    }

    this.selector = selectCSD<I>(this.name);
  }

  set channel (channel: any | null) {
    if (channel && this._channel) {
      console.error(`%c DUPLICATION ${this.name} `, 'color: #FF6766; font-weight: bolder; font-size: 18px;'
        , '\n Please make sure you use only one instance of Controller within DOM in same time'
        , '\n CACHE:', this
      );
    }
    if (this.DEBUG) {
      console.info(`%c set channel ${this.name} `, 'color: #FF6766; font-weight: bolder; font-size: 16px;'
        , '\n CACHE:', this
        , '\n channel:', channel
      );
    }
    this._channel = channel;
  }

  get channel () {
    return this._channel;
  }
}

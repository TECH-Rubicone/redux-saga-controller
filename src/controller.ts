
// outsource dependencies
import { ActionCreator, AnyAction } from 'redux';

// local dependencies
import { isArray, isBoolean, isGeneratorFunction, isObject, isString, uniqueId } from './utils';
import { updateCSD, clearCSD, selectAllCSD, selectInitialCSD, selectActualCSD, selectConnectedCSD } from './reducer';

export type DefaultActions = 'updateCtrl' | 'clearCtrl'

export class Controller<T extends string, I> {
  // NOTE Debug value to show additional logs when it is enabled
  DEBUG: boolean;

  // NOTE Initial values of reducer
  initial = {} as I;

  // NOTE Controller name
  name: string;

  // NOTE All Action types which are passed to types
  TYPE = {} as Record<T, string>;

  // NOTE Selector function to get state of controller reducer
  selector;

  selectorInitial;

  selectorActual;

  selectorConnected;

  // NOTE Redux saga subscriber
  subscriber: any; // () => Generator<ForkEffect<never>, void, unknown>;

  // NOTE All action creators which are generated by types
  action = {} as Record<T | DefaultActions, ActionCreator<AnyAction>>;

  // NOTE Subscriber wrapped with Fork
  private _channel: any = null;

  constructor ({ types = [], prefix, initial, subscriber, DEBUG = false } : {
    initial: I,
    DEBUG?: boolean,
    prefix?: string,
    types: Array<T>,
    subscriber: any,
  }) {
    // NOTE Setup DEBUG value if present and is valid
    this.DEBUG = isBoolean(DEBUG) ? DEBUG : false;
    // NOTE Generate name if prefix present and is valid
    this.name = isString(prefix) ? uniqueId(prefix) : uniqueId();
    // NOTE Check types and rewrite value if it isn't valid
    types = isArray(types) ? types : [];
    // NOTE Setup initial data if present and is valid
    if (isObject(initial)) { this.initial = initial; }
    // NOTE Prepare default actions
    this.action.clearCtrl = clearCSD(this.name);
    this.action.updateCtrl = updateCSD<I>(this.name);
    // NOTE prepare createTypes and actions
    for (const type of types) {
      // NOTE Generate Acton types
      this.TYPE[type] = `${this.name}/${type.toUpperCase()}`;
      // NOTE Generate Acton creators
      this.action[type] = <T>(payload?: T) => ({ type: this.TYPE[type], payload });
    }
    // NOTE Prepare selector for controller by name
    this.selector = selectAllCSD<I>(this.name);
    this.selectorActual = selectActualCSD<I>(this.name);
    this.selectorInitial = selectInitialCSD<I>(this.name);
    this.selectorConnected = selectConnectedCSD<I>(this.name);
    // NOTE Setup subscriber if it valid or throw an error
    if (!isGeneratorFunction(subscriber)) {
      throw new Error(`Controller(${this.name}) "subscriber" is required and should be generator "sagas"`);
    } else {
      this.subscriber = subscriber;
    }
  }

  // NOTE Setter to set channel
  set channel (channel: any) {
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

  // NOTE Getter to get channel
  get channel () {
    return this._channel;
  }
}

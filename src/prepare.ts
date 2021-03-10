
// outsource dependencies
import { Task } from 'redux-saga';

// local dependencies
import { pinClearCSD, pinUpdateCSD, selectActualCSD } from './reducer';
import { SECRET, forceCast, createAction, typeCase, actionCase, hash, Subscriber, CtrlActionCreators, CtrlOptions } from './constant';

/**
 * generate annotation for controller using minimal input data
 * @param options
 * @returns {{
  subscriber: *,
  selector: (function(*=): *),
  initial: {},
  name: string,
  action: {
    updateCtrl: (function(*=): {payload: *, name: *, type: string}),
    clearCtrl: (function(): {name: *, type: string})
 *: (function(): {name: *, type: string})
  }
 }}
 */
// NOTE simple wrapper which provide types to constructor - not good enough :(
export function prepareController<Initial, Actions> ({ prefix, subscriber, initial, types }: {
    prefix: string,
    types: string[],
    initial: Initial,
    subscriber: unknown, // *^ ...implicitly...
  }): Controller<Initial, Actions> {
  return new Controller({
    name: `${prefix}-${hash()}`,
    subscriber,
    initial,
    types,
  });
}

export class Controller<Initial, Actions> {
  /*************************************************************************************
   * 'controller' implicitly has type 'any' because it does not have a type annotation
   * and is referenced directly or indirectly in its own initializer.
   ************************************************************************************/
  private readonly sagaSubscriber;

  private readonly types: string[];

  private channel?: Task;

  public readonly reducerInitial = {} as Initial;

  public name: string;

  public selector;

  constructor ({ name, initial, types, subscriber }: {
    name: string,
    initial: Initial,
    types: string[],
    subscriber: unknown, // *^ ...implicitly...
  }) {
    this.name = name;
    this.types = types;
    this.sagaSubscriber = subscriber;
    this.reducerInitial = initial;
    // NOTE base selector
    this.selector = selectActualCSD<Initial>(name);
  }

  public get action (): Actions {
    const action: CtrlActionCreators = {
      clearCtrl: pinClearCSD(this.name),
      updateCtrl: pinUpdateCSD(this.name),
    };
    // NOTE generate actions
    for (const type of this.types) {
      // this
      const actName = actionCase(type);
      action[actName] = createAction(`@${this.name}/${typeCase(type)}`);
      // or this
      action[type] = createAction(`@${this.name}/${typeCase(type)}`);
    }
    return forceCast<Actions>(action);
  }

  public get subscriber (): Subscriber {
    return forceCast<Subscriber>(this.sagaSubscriber);
  }

  public get initial (): Initial {
    return Object.assign({}, this.reducerInitial);
  }

  public hasChannel (): boolean { return Boolean(this.channel); }

  public getChannel (secret: symbol): Task {
    if (secret !== SECRET) {
      throw new Error(`Unavailable access to private channel of ${this.name} detected !`);
    }
    return forceCast<Task>(this.channel);
  }

  public setChannel (channel?: Task): void {
    if (channel && this.hasChannel()) {
      throw new Error(`Duplicate controller subscription detected for "${this.name}"`);
      // console.error(
      //   `%c DUPLICATION FOR CONTROLLER: ${this.name} `, 'color: #FF6766; font-weight: bolder; font-size: 18px;'
      //   , '\n Please make sure you use only one instance of Controller within DOM in same time'
      //   , '\n controller:', this
      // );
    }
    this.channel = channel;
  }
}

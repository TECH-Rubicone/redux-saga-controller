
// outsource dependencies
import { Task } from 'redux-saga';

// local dependencies
import { typeCase, actionCase } from './name';
import { forceCast } from './constant';
import { pinClearCSD, pinUpdateCSD, createAction, selectActualCSD } from './reducer';
import { CtrlActionCreators, CtrlOptions, InitialState, Subscriber, CtrlActionCreator, CtrlSystemActionTypes } from './type.spec';

let counter = 0;
const hash = (): string => String(`XXX${++counter}`)
  // eslint-disable-next-line no-bitwise
  .replace('X', () => (Math.random() * 32 | 0).toString(32));

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
export function prepareController<Initial, Type extends string> ({ prefix, subscriber, initial, types }: {
    prefix: string,
    initial: Initial,
    types: Array<Type>,
    subscriber: Subscriber,
  }): Controller<Type, Initial> {
  return new Controller({
    prefix: `@${prefix}-${hash()}`,
    initial,
    types,
    subscriber,
  });
}
// !!! not good :(
// export function prepareController<Initial> ({ prefix, subscriber, initial, types }: {
//     prefix: string,
//     initial: Initial,
//     types: ActionName[],
//     subscriber: Subscriber,
//   }): Controller<Initial> {
//   return new Controller(
//     `${prefix}-${hash()}`,
//     initial,
//     types,
//     subscriber,
//   );
// }

export class Controller<Type extends string, Initial> {
  private channel?:Task;

  private readonly subscriber: Subscriber;

  private readonly initial = {} as Initial;

  action = {} as Record<Type | CtrlSystemActionTypes, CtrlActionCreator>;

  selector;

  name: string;

  constructor ({ prefix, initial, types, subscriber }: {
    prefix: string,
    initial: Initial,
    types: Array<Type>,
    subscriber: Subscriber,
  }) {
    // NOTE
    const name = `@${prefix}-${hash()}` as const;
    this.name = name;
    // NOTE subscriber
    this.subscriber = subscriber;
    // NOTE initial
    this.initial = initial;
    // NOTE custom actions
    for (const type of types) {
      // if (typeof type === 'string') {
      this.action[type] = createAction(`${name}/${type.toUpperCase()}`);
      // }
    }
    // NOTE base ctrl actions

    // export const CLEAR_ACTION_NAME = 'clearCtrl';
    // export const UPDATE_ACTION_NAME = 'updateCtrl';
    this.action['clearCtrl' as Type] = pinClearCSD(name);
    this.action['updateCtrl' as Type] = pinUpdateCSD(name);
    // NOTE base selector
    this.selector = selectActualCSD<Initial>(name);
  }

  // public getInitial (): Initial { return Object.assign({}, this.initial); }
  public getInitial (): Initial { return this.initial; }

  public getSubscriber (): Subscriber { return this.subscriber; }

  public hasChannel (): boolean { return Boolean(this.channel); }

  public getChannel (): Task { return forceCast<Task>(this.channel); }

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

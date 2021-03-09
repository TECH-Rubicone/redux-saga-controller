
// outsource dependencies
import { AnyAction, ActionCreator } from 'redux';
import { Task } from 'redux-saga';

// local dependencies
import { forceCast, createAction, typeCase, hash } from './constant';
import { pinClearCSD, pinUpdateCSD, selectActualCSD } from './reducer';
import { CtrlActionCreator, CtrlActionCreators } from './type.spec';

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
// export function prepareController<Initial, Type extends string> ({ prefix, subscriber, initial, types }: {
//     prefix: string,
//     initial: Initial,
//     types: Array<Type>,
//     subscriber: Subscriber,
//   }): Controller<Type, Initial> {
//   return new Controller({
//     prefix: `@${prefix}-${hash()}`,
//     initial,
//     types,
//     subscriber,
//   });
// }
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
type Subscriber = () => IterableIterator<unknown>;
type CtrlSystemActionTypes = 'updateCtrl' | 'clearCtrl';

export class Controller<Type extends string, Initial> {
  // ```````````````````````````````````````````````````````````````````````````````````
  //  'controller' implicitly has type 'any' because it does not have a type annotation
  //  and is referenced directly or indirectly in its own initializer.
  // ````````````````````````````````````````````````````````````````````````````````````
  private readonly subscriber;

  private channel?: Task;

  private readonly initial = {} as Initial;

  action = {} as Record<Type | CtrlSystemActionTypes, CtrlActionCreator>;

  selector;

  name: string;

  constructor ({ prefix, initial, types, subscriber }: {
    prefix?: string,
    initial: Initial,
    types: Array<Type>,
    subscriber: unknown, // *^
  }) {
    // NOTE
    const name = typeof prefix === 'string' ? `@${prefix}-${hash()}` : `@${hash()}`;
    this.name = name;
    // NOTE subscriber
    this.subscriber = subscriber;
    // NOTE initial
    this.initial = initial;
    // NOTE base selector
    this.selector = selectActualCSD<Initial>(name);
    // NOTE base ctrl actions
    this.action.clearCtrl = pinClearCSD(name);
    this.action.updateCtrl = pinUpdateCSD(name);
    // NOTE generic actions
    for (const type of types) {
      // const actName = actionCase(type);
      this.action[type] = createAction(`${name}/${typeCase(type)}`);
    }
  }

  public getInitial (): Initial { return Object.assign({}, this.initial); }

  public getSubscriber (): Subscriber { return forceCast<Subscriber>(this.subscriber); }

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

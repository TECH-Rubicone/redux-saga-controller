
// outsource dependencies
import { Task } from 'redux-saga';

// local dependencies
import { forceCast, createAction, typeCase, hash, Subscriber, CtrlSystemActionTypes, CtrlActionCreator } from './constant';
import { pinClearCSD, pinUpdateCSD, selectActualCSD } from './reducer';

/**
 * simple wrapper which provide types to constructor - not good enough :(
 * @example
 export const controller = prepareController({
      initial, // Setup initial data for redux state
      prefix: 'root', // Controller name
      types: ['INITIALIZE', 'GET_SELF'], // Types for which action creators will be generated
      subscriber: function * () {
        yield takeEvery(controller.action.INITIALIZE.TYPE, initializeSaga);
      }
 });
 */
export function prepareController<Type extends string, Initial> ({ prefix, subscriber, initial, types }: {
    prefix: string,
    types: Type[],
    initial: Initial,
    subscriber: unknown, // *^ ...implicitly...
  }): Controller<Type, Initial> {
  return new Controller({
    name: `${prefix}-${hash()}`,
    initial,
    types,
    subscriber,
  });
}

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

  constructor ({ name, initial, types, subscriber }: {
    name: string,
    initial: Initial,
    types: Array<Type>,
    subscriber: unknown, // *^ ...implicitly...
  }) {
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
      this.action[type] = createAction(`@${name}/${typeCase(type)}`);
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

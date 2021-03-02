
// outsource dependencies
import { Task } from 'redux-saga';

// local dependencies
import { hash, forceCast } from './_';
import { pinClearCSD, pinUpdateCSD, createAction } from './reducer';
import { CtrlActionCreators, CtrlOptions, InitialState, Subscriber } from './types';

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
export function prepareController<
  Actions = CtrlActionCreators,
  Initial = InitialState,
  > ({ prefix, subscriber, initial, types }: CtrlOptions) {
  const name = `${prefix}-${hash()}`;

  const action: CtrlActionCreators = {
    updateCtrl: pinUpdateCSD(name),
    clearCtrl: pinClearCSD(name),
  };
  // NOTE prepare createTypes and actions
  for (const type of types) {
    // NOTE Generate Actions
    action[type] = createAction(type.toUpperCase());
  }

  return new Controller(
    name,
    forceCast<CtrlActionCreators & Actions>(action),
    forceCast<Initial>(initial),
    subscriber,
  );
}

export class Controller<
  Actions = CtrlActionCreators,
  Initial = InitialState,
  > {
  private channel?:Task;

  constructor (
    public name: string,
    public action: Actions,
    private initial: Initial,
    private subscriber: Subscriber,
  ) {
    // for (const type of types) {
    //   // NOTE Generate Acton types
    //   this.TYPE[type] = `${this.name}/${type}`;
    //   // NOTE Generate Acton creators
    //   this.action[type] = <T>(payload?: T) => ({ type: this.TYPE[type], payload });
    // }
  }

  public getInitial () { return Object.assign({}, this.initial); }

  public getSubscriber () { return this.subscriber; }

  public hasChannel () { return Boolean(this.channel); }

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

// TODO REMOVE
// interface TestInitial extends InitialState {
//   best: boolean;
// }
// const initial: TestInitial = { best: true };
// const x: ControllerAnnotation = prepareController({
//   initial,
//   prefix: 'a',
//   subscriber: function * (): Generator { yield 1; },
//   types: ['qwe'],
// });
//
// x.action.qwe();
// x.action.qwe.TYPE;

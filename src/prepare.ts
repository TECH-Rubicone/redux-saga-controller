
// outsource dependencies
import { Task } from 'redux-saga';

// local dependencies
import { hash, forceCast } from './_';
import { pinClearCSD, pinUpdateCSD, createAction, CtrlActionCreator } from './reducer';

type Subscriber = () => IterableIterator<unknown>;

export type InitialState<I = unknown> = Record<string, I>;

export interface CtrlActionCreators {
  clearCtrl: CtrlActionCreator;
  updateCtrl: CtrlActionCreator;
  [key: string]: CtrlActionCreator;
}
export interface CtrlOptions<I = unknown> {
  types: string[];
  prefix: string;
  subscriber: Subscriber;
  initial: InitialState<I>;
}

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
export const prepare = ({ prefix, subscriber, initial, types }: CtrlOptions): ControllerAnnotation => {
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

  return new ControllerAnnotation(
    name,
    action,
    initial,
    subscriber,
  );
};

export class ControllerAnnotation<Initial = InitialState> {
  private channel?:Task;

  constructor (
    public name: string,
    public action: CtrlActionCreators,
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

export const castToCtrl = (data: unknown):ControllerAnnotation => {
  if (!(data instanceof ControllerAnnotation)) {
    throw new Error('Incorrect Controller annotation');
  }
  return data;
};

// TODO REMOVE
interface TestInitial extends InitialState {
  best: boolean;
}
const initial: TestInitial = { best: true };
const x = prepare({
  initial,
  prefix: 'a',
  subscriber: function * (): Generator { yield 1; },
  types: ['qwe'],
});

x.action.qwe();
x.action.qwe.TYPE;

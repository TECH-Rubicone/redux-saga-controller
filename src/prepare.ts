
// outsource dependencies
import { Task } from 'redux-saga';

// local dependencies
import { forceCast } from './_';
import { pinClearCSD, pinUpdateCSD, createAction, selectActualCSD } from './reducer';
import { CtrlActionCreators, CtrlOptions, InitialState, Subscriber, CtrlActionCreator } from './types';

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
export function prepareController<
  Types extends string,
  Actions = CtrlActionCreators,
  Initial = InitialState,
  > ({ prefix, subscriber, initial, types }: CtrlOptions<Types, Initial>) {
  const name = `${prefix}-${hash()}`;

  return new Controller(
    name,
    createCtrlActions<Actions, Types>(types, name),
    initial,
    subscriber,
  );
}

export class Controller<
  Actions = CtrlActionCreators,
  Initial = InitialState,
  > {
  private channel?:Task;

  selector;

  constructor (
    public name: string,
    public action: Actions,
    private initial: Initial,
    private subscriber: Subscriber,
  ) {
    this.selector = selectActualCSD<Initial>(this.name);
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

function createCtrlActions <Actions, Types extends string> (types: Array<Types>, name: string): Actions {
  const ACTS = {} as Record<Types, CtrlActionCreator>;
  for (const type of types) {
    ACTS[type] = createAction(`${name}/${type.toUpperCase()}`);
  }
  return forceCast<Actions>({
    ...ACTS,
    updateCtrl: pinUpdateCSD(name),
    clearCtrl: pinClearCSD(name),
  });
}

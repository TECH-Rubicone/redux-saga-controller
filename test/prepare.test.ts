
// outsource dependencies

// local dependencies
import { Subscriber } from '../src/saga';
import { prepareController } from '../src';
import { ERROR, SECRET, forceCast } from '../src/constant';

// configure
const prefix = 'test';
type Initial = { test: boolean };
const initial = { test: true };
function * subscriber () { /* NOTE do nothing */ }
type Actions = { test: string };
const actionsInfo = {
  test: 't',
  test0: 't',
  test1: 't1',
  test2: 't2',
  test3: 't3',
};
const asFnShape = {
  clearCtrl: expect.any(Function),
  updateCtrl: expect.any(Function)
};
// @ts-ignore
Object.keys(actionsInfo).map(prop => asFnShape[prop as const] = expect.any(Function));
const asObjShape = {};
// @ts-ignore
Object.keys(actionsInfo).map(prop => asObjShape[prop as const] = expect.objectContaining({
// @ts-ignore
  TYPE: expect.stringContaining(actionsInfo[prop]),
  toString: expect.any(Function),
}));
const schemaShape = {
  select: expect.any(Function),
  id: expect.stringContaining(prefix),
  action: expect.objectContaining(asObjShape),
  [SECRET]: expect.objectContaining({
    initial,
    subscriber,
  }),
};

describe('Controller preparing', () => {

  it('should check "CtrlOptions"', () => {
    const notSubscriber = forceCast<Subscriber>(undefined);
    const notInitial = forceCast<Initial>(undefined);
    const notActions = forceCast<Actions>(undefined);
    expect(() => prepareController(actionsInfo, subscriber, initial, prefix)).not.toThrow();
    expect(() => prepareController(actionsInfo, subscriber, initial)).not.toThrow();
    expect(() => prepareController(actionsInfo, subscriber, notInitial)).toThrow(new Error(ERROR.PREPARE_INITIAL_REQUIRED()));
    expect(() => prepareController(actionsInfo, notSubscriber, notInitial)).toThrow(new Error(ERROR.PREPARE_SUBSCRIBER_REQUIRED()));
    expect(() => prepareController(notActions, notSubscriber, notInitial)).toThrow(new Error(ERROR.PREPARE_ACTIONS_REQUIRED()));
  });

  it('unique controller "id" rules', () => {
    const ctrl1 = prepareController(actionsInfo, subscriber, initial, prefix);
    expect(ctrl1.id).toContain(prefix);
    expect(ctrl1.id).not.toEqual(prefix);
    const ctrl2 = prepareController(actionsInfo, subscriber, initial);
    expect(ctrl2.id).not.toContain(prefix);
    expect(typeof ctrl2.id === 'string').toBeTruthy();
    expect(ctrl1.id).not.toEqual(ctrl2.id);
  });

  it('should generate action creators', () => {
    const testCtrl = prepareController(actionsInfo, subscriber, initial);
    expect(testCtrl).toEqual(
      expect.objectContaining({
        action: expect.objectContaining(asFnShape),
      })
    );
  });

  it('action creators "type"', () => {
    const testCtrl = prepareController(actionsInfo, subscriber, initial);
    expect(testCtrl).toEqual(
      expect.objectContaining({
        action: expect.objectContaining(asObjShape),
      })
    );
  });

  it('should match schema', () => {
    const testCtrl = prepareController(actionsInfo, subscriber, initial, prefix);
    expect(testCtrl).toEqual(
      expect.objectContaining(schemaShape)
    );
  });

});

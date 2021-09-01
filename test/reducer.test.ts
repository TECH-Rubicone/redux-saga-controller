
// outsource dependencies

// local dependencies
import { TestStore } from './test.mock';
import { ERROR } from '../src/constant';
import { forceCast } from '../src/constant';
import { Controller, prepareController, reducer, path } from '../src';
import { createSelectorIsConnected, extraReducers } from '../src/reducer';
import { createCSDAction, removeCSDAction, updateCSDAction, clearCSDAction, updateCSDMetaAction } from '../src/actions';

// configure
const prefix = 'test';
const initial = { test: true };
function * subscriber () { /* NOTE do nothing */ }
const actionsInfo = { test: 'jest-test-reducer-action' };
const ctrl: Controller = prepareController(
  actionsInfo,
  subscriber,
  initial,
  prefix
);
const store = new TestStore(reducer, path);

describe('Controller reducer @CSD-store', () => {
  it('should exist', () => {
    expect(reducer).toBeInstanceOf(Function);
  });

  describe('@CSD-store', () => {
    it('Should care "isConnected"', () => {
      const select = createSelectorIsConnected(ctrl.id);
      expect(store.select(select)).toEqual(false);
      // NOTE emulate saga action "subscribe"
      store.dispatch(updateCSDMetaAction({ id: ctrl.id, data: { connected: true } }));
      expect(store.select(select)).toEqual(true);
      // NOTE emulate saga action "unsubscribe"
      store.dispatch(updateCSDMetaAction({ id: ctrl.id, data: { connected: false } }));
      expect(store.select(select)).toEqual(false);
    });
  });

  describe('Controller reducer', () => {
    it('create store data', () => {
      store.dispatch(createCSDAction({ id: ctrl.id, data: initial }));
      // NOTE updated data
      expect(store.select((state: any) => state[path][ctrl.id])).toEqual(
        expect.objectContaining(initial)
      );
    });

    it('skip unrelated actions', () => {
      store.dispatch(ctrl.action.test({}));
      // NOTE updated data
      expect(store.select((state: any) => state[path][ctrl.id])).toEqual(
        initial
      );
      store.dispatch({ type: 'unknown action' });
      // NOTE updated data
      expect(store.select((state: any) => state[path][ctrl.id])).toEqual(
        initial
      );
    });

    it('main selector', () => {
      expect(ctrl.select).toBeInstanceOf(Function);
      // NOTE by default initial
      expect(store.select(ctrl.select)).toEqual(
        expect.objectContaining(initial)
      );
      store.dispatch(updateCSDAction({ id: ctrl.id, data: { test2: 2 } }));
      // NOTE updated data
      expect(store.select(ctrl.select)).toEqual(
        expect.objectContaining({ ...initial, test2: 2 })
      );
    });

    it('clear data', () => {
      store.dispatch(updateCSDAction({ id: ctrl.id, data: { some: 'data' } }));
      store.dispatch(clearCSDAction({ id: ctrl.id }));
      // NOTE updated data
      expect(store.select(ctrl.select)).toEqual(
        expect.objectContaining(initial)
      );
    });
    it('clear store data', () => {
      store.dispatch(removeCSDAction({ id: ctrl.id }));
      // NOTE updated data
      expect(store.select((state: any) => state[path][ctrl.id])).toEqual(
        null
      );
    });
    it('Should inherit store data on create', () => {
      const update = { some: 'data', test: false };
      store.dispatch(createCSDAction({ id: ctrl.id, data: initial }));
      // NOTE updated data
      store.dispatch(updateCSDAction({ id: ctrl.id, data: update }));
      store.dispatch(createCSDAction({ id: ctrl.id, data: initial }));
      expect(store.select((state: any) => state[path][ctrl.id])).toEqual(
        expect.objectContaining(update)
      );
    });
  });

  describe('extra reducers', () => {
    it('Should validate entry', () => {
      expect(() => extraReducers(forceCast(''))).toThrow(new Error(ERROR.EXTRA_REDUCER_VALIDATION()));
      expect(() => extraReducers(forceCast([]))).toThrow(new Error(ERROR.EXTRA_REDUCER_VALIDATION()));
      expect(() => extraReducers(forceCast(() => ''))).toThrow(new Error(ERROR.EXTRA_REDUCER_VALIDATION()));
      expect(() => extraReducers(forceCast({ test: 'validation' }))).toThrow(new Error(ERROR.EXTRA_REDUCER_VALIDATION()));
      expect(() => extraReducers(forceCast({}))).not.toThrow(new Error(ERROR.EXTRA_REDUCER_VALIDATION()));
      expect(() => extraReducers(forceCast({ test: () => '' }))).not.toThrow(new Error(ERROR.EXTRA_REDUCER_VALIDATION()));
    });
    it('Should affect controller state', () => {
      const type = 'test';
      const data = { ha: 'ha' };
      const extraHandler = () => data;
      // NOTE setup extra handler
      extraReducers(forceCast({ [type]: extraHandler }));
      // NOTE set store data
      store.dispatch(createCSDAction({ id: ctrl.id, data: initial }));
      // NOTE fire extra reducer action
      store.dispatch({ type });
      expect(store.select((state: any) => state[path])).toEqual(data);
    });
  });
});


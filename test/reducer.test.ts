
// outsource dependencies
import { combineReducers, Store, Reducer, AnyAction } from 'redux';

// local dependencies
import {
  reducer,
  selectActualCSD,
  selectIsConnectedCSD,
  createCSDAction,
  clearCSDAction,
  removeCSDAction,
  updateCSDAction,
  updateCSDMetaAction,
} from '../src/reducer';
import { prepareController, REDUCER_PATH } from '../src';

import { testPrefix as prefix, testTypes as types, testInitial as initial, formattedActionNames, formattedTypeNames, testSubscriber as subscriber, TestStore } from './test.mock';

// configure
const ctrl = prepareController({ prefix, types, initial, subscriber });
const store = new TestStore(reducer, REDUCER_PATH);

describe('Controller reducer @CSD-store', () => {
  describe('@CSD-store', () => {
    it('Should care "isConnected"', () => {
      const selector = selectIsConnectedCSD(ctrl.name);
      expect(store.select(selector)).toEqual(false);
      // NOTE emulate saga action "subscribe"
      store.dispatch(updateCSDMetaAction({ name: ctrl.name, connected: true }));
      store.select((state: unknown) => console.log('STATE', state));
      expect(store.select(selector)).toEqual(true);
      // NOTE emulate saga action "unsubscribe"
      store.dispatch(updateCSDMetaAction({ name: ctrl.name, connected: false }));
    });
  });

  describe('Controller reducer', () => {
    it('should generate main selector', () => {
      expect(ctrl.selector).toBeInstanceOf(Function);
    });

    it('should care "initial" on empty state', () => {
      expect(store.select(ctrl.selector)).toEqual(expect.objectContaining(ctrl.initial));
    });
  });

});


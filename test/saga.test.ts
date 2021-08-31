
// outsource dependencies
import { testSaga, expectSaga } from 'redux-saga-test-plan';
import { createMockTask } from '@redux-saga/testing-utils';

// local dependencies
import { ERROR, forceCast, SECRET } from '../src/constant';
import { Controller, prepareController } from '../src/prepare';
import { sagas, subscribeSaga, unsubscribeSaga } from '../src/saga';
import { subscribeAction, unsubscribeAction, updateCSDMetaAction } from '../src/actions';

// configure
const ctrl: Controller = prepareController(
  { test: 'jest-test-reducer-action' },
  function * subscriber () { /* NOTE do nothing */ },
  { test: true },
);

describe('Controller subscription', () => {

  it('initialize "saga"', () => {
    testSaga(sagas)
      .next()

      .takeEvery(subscribeAction.TYPE, subscribeSaga)
      .next()

      .takeEvery(unsubscribeAction.TYPE, unsubscribeSaga)
      .next()

      .isDone();
  });

  it('should SUBSCRIBE controller', () => {
    testSaga(subscribeSaga, subscribeAction(ctrl))
      .next()

      .fork(ctrl[SECRET].subscriber)
      .next()

      .put(updateCSDMetaAction({ id: ctrl.id, data: { connected: true } }))
      .next()

      .isDone();
  });

  it('should warn SUBSCRIBE controller more then once', () => {
    // NOTE lets assume the channel there means was subscribed before
    ctrl[SECRET].channel = createMockTask();
    // NOTE due to problems with throwing sagas within "redux-saga-test-plan"
    try {
      subscribeSaga(subscribeAction(ctrl)).next();
    } catch (error) {
      expect(error.message).toEqual(ERROR.SAGA_SUBSCRIBE_DUPLICATION(ctrl.id));
    }
  });

  it('should UNSUBSCRIBE controller', () => {
    // NOTE lets assume the channel there
    const channel = ctrl[SECRET].channel = createMockTask();
    testSaga(unsubscribeSaga, unsubscribeAction(ctrl))
      .next()

      .put(updateCSDMetaAction({ id: ctrl.id, data: { connected: false } }))
      .next()

      .cancel(channel)
      .next()

      .isDone();
  });

  it('should prevent "cancel" on UNSUBSCRIBE controller to avoid killing main process', () => {
    testSaga(unsubscribeSaga, unsubscribeAction(ctrl))
      .next()

      .put(updateCSDMetaAction({ id: ctrl.id, data: { connected: false } }))
      .next()

      .isDone();
  });

});

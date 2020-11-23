
// outsource dependencies
import { testSaga } from 'redux-saga-test-plan';

// local dependencies
import { testCtrl } from './test.mock';
import { updateCSDMetaAction } from './reducer';
import { TYPE, subscribeAction, unsubscribeAction, subscribeSaga, unsubscribeSaga, sagas } from './saga';


describe('Controller subscription', () => {

  it('initialize "saga"', () => {
    testSaga(sagas)
      .next()

      .takeEvery(TYPE.SUBSCRIBE, subscribeSaga)
      .next()

      .takeEvery(TYPE.UNSUBSCRIBE, unsubscribeSaga)
      .next()

      .isDone();
  });

  it('should SUBSCRIBE controller', () => {
    const action = subscribeAction(testCtrl);
    testSaga(subscribeSaga, action)
      .next()

      .fork(action.controller.subscriber)
      .next()

      .put(updateCSDMetaAction(action.controller.name, { connected: true }))
      .next()

      .isDone();
  });

  it('should UNSUBSCRIBE controller', () => {
    const action = unsubscribeAction(testCtrl);
    testSaga(unsubscribeSaga, action)
      .next()

      .put(updateCSDMetaAction(action.controller.name, { connected: false }))
      .next()

      .cancel(action.controller.channel)
      .next()

      .isDone();
  });

});

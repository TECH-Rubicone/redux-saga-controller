
// outsource dependencies
import { fork, takeEvery, cancel, put } from 'redux-saga/effects';
// local dependencies
import { updateCSDMetaAction } from './reducer';
// NOTE specific saga actions to subscribe and unsubscribe controllers by annotation
const TYPE = (prefix => ({
  SUBSCRIBE: `${prefix}SUBSCRIBE`,
  UNSUBSCRIBE: `${prefix}UNSUBSCRIBE`,
}))('@CSD-action/');

export const subscribeAction = controller => ({ controller, type: TYPE.SUBSCRIBE });
function * subscribeSaga ({ type, controller }) {
  // console.log(`%c ${type}: ${controller.name} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;'
  //   , '\n controller:', controller
  // );
  if (controller.channel) {
    console.error(`%c DUPLICATION ${controller.name} `, 'color: #FF6766; font-weight: bolder; font-size: 18px;'
      , '\n Please make sure you use only one instance of Controller within DOM in same time'
      , '\n CACHE:', controller
    );
  }
  controller.channel = yield fork(controller.subscriber);
  // NOTE store mark in to redux to provide correct watching of changes
  yield put(updateCSDMetaAction(controller.name, { connected: true }));
}

export const unsubscribeAction = controller => ({ controller, type: TYPE.UNSUBSCRIBE });
function * unsubscribeSaga ({ type, controller }) {
  // console.log(`%c ${type}: ${controller.name} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;'
  //   , '\n controller:', controller
  // );
  // NOTE store mark in to redux to provide correct watching of changes
  yield put(updateCSDMetaAction(controller.name, { connected: false }));
  yield cancel(controller.channel);
  controller.channel = null;
}

export function * sagas () {
  yield takeEvery(TYPE.SUBSCRIBE, subscribeSaga);
  yield takeEvery(TYPE.UNSUBSCRIBE, unsubscribeSaga);
}

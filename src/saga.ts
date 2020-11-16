// NOTE +


// outsource dependencies
import { fork, takeEvery, cancel, put } from 'redux-saga/effects';

// local dependencies
import { Action } from './interfaces';
import Controller from './controller';
import { updateCSDMetaAction } from './reducer';

// NOTE specific saga action types to subscribe and unsubscribe controller by annotation
const TYPE = (prefix => ({
  SUBSCRIBE: `${prefix}SUBSCRIBE`,
  UNSUBSCRIBE: `${prefix}UNSUBSCRIBE`,
}))('@CSD-action/');

export const subscribeAction = <T extends string, I>(controller: Controller<T, I>) => ({
  type: TYPE.SUBSCRIBE,
  payload: { controller },
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function * subscribeSaga ({ type, payload: { controller } } : Action) {
  // console.log(`%c ${type}: ${payload.name} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;'
  //   , '\n payload:', payload
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

export const unsubscribeAction = <T extends string, I>(controller: Controller<T, I>) => ({
  type: TYPE.UNSUBSCRIBE,
  payload: { controller },
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function * unsubscribeSaga ({ type, payload: { controller } } : Action) {
  // console.log(`%c ${type}: ${payload.name} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;'
  //   , '\n payload:', payload
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

export default sagas;

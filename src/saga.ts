
// outsource dependencies
import { fork, takeEvery, cancel, put } from 'redux-saga/effects';

// local dependencies
import { forceCast } from './_';
import { Controller } from './prepare';
import { SAGA_PREFIX } from './constant';
import { updateCSDMetaAction, createAction } from './reducer';
import { CtrlPayload, CtrlActionCreator, CtrlAction } from './types';

function * subscribeSaga ({ payload }: CtrlAction<SagaPayload>) {
  const controller = forceCast<Controller>(payload.controller);
  const name: string = controller.name;
  const channel = yield fork(controller.getSubscriber);
  controller.setChannel(channel);
  // NOTE store mark in to redux to provide correct watching of changes
  yield put(updateCSDMetaAction({ name, connected: true }));
}

function * unsubscribeSaga ({ payload }: CtrlAction<SagaPayload>) {
  const controller = forceCast<Controller>(payload.controller);
  const name: string = controller.name;
  const channel = controller.getChannel();
  // NOTE store mark in to redux to provide correct watching of changes
  yield put(updateCSDMetaAction({ name, connected: false }));
  // NOTE important thing to prevent cancelation of subscriber channel
  if (controller.hasChannel()) {
    yield cancel(channel);
  }
  controller.setChannel();
}

interface SagaPayload extends CtrlPayload {
  payload: {
    controller: Controller
  }
}
export const subscribeAction: CtrlActionCreator<SagaPayload> = createAction(`${SAGA_PREFIX}/SUBSCRIBE`);
export const unsubscribeAction: CtrlActionCreator<SagaPayload> = createAction(`${SAGA_PREFIX}/UNSUBSCRIBE`);
export function * sagas () {
  yield takeEvery(subscribeAction.TYPE, subscribeSaga);
  yield takeEvery(unsubscribeAction.TYPE, unsubscribeSaga);
}

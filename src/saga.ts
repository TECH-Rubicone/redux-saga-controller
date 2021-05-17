
// outsource dependencies
import { Task } from 'redux-saga';
import { fork, takeEvery, cancel, put } from 'redux-saga/effects';

// local dependencies
import { Controller } from './prepare';
import { ERROR, SECRET, forceCast } from './constant';
import { updateCSDMetaAction, subscribeAction, unsubscribeAction } from './actions';

export function * subscribeSaga<Actions, Initial> ({
  payload: controller
}: { payload: Controller<Actions, Initial> }) {
  const id = controller.id;
  const subscriber = controller[SECRET].subscriber;
  if (controller[SECRET].channel) {
    throw new Error(ERROR.SAGA_SUBSCRIBE_DUPLICATION(id));
  }
  controller[SECRET].channel = yield fork(subscriber);
  // NOTE store mark in to redux to provide correct watching of changes
  yield put(updateCSDMetaAction({ id, data: { connected: true } }));
}

export function * unsubscribeSaga<Actions, Initial> ({
  payload: controller
}: { payload: Controller<Actions, Initial> }) {
  const id = controller.id;
  // NOTE store mark in to redux to provide correct watching of changes
  yield put(updateCSDMetaAction({ id, data: { connected: false } }));
  // NOTE important thing to prevent cancelation of subscribers channel
  const channel = forceCast<Task>(controller[SECRET].channel);
  if (channel) {
    yield cancel(channel);
  }
  delete controller[SECRET].channel;
}

export type Subscriber = () => IterableIterator<unknown>;
// NOTE fix saga types overload fatal error
type SagaWatcher = (any: unknown) => unknown;
export function * sagas () {
  yield takeEvery(subscribeAction.TYPE, forceCast<SagaWatcher>(subscribeSaga));
  yield takeEvery(unsubscribeAction.TYPE, forceCast<SagaWatcher>(unsubscribeSaga));
}


// outsource dependencies
import { Task } from 'redux-saga';
import { fork, takeEvery, cancel, put } from 'redux-saga/effects';

// local dependencies
import { Controller } from './prepare';
import { updateCSDMetaAction } from './reducer';
import { SECRET, SAGA_PREFIX, createAction, forceCast } from './constant';

function * subscribeSaga<Initial, Actions> ({ payload: controller }: { payload: Controller<Initial, Actions> }) {
  const name = controller.name;
  const channel: Task = yield fork(controller.subscriber);
  controller.setChannel(channel);
  // NOTE store mark in to redux to provide correct watching of changes
  yield put(updateCSDMetaAction({ name, connected: true }));
}

function * unsubscribeSaga<Initial, Actions> ({ payload: controller }: { payload: Controller<Initial, Actions> }) {
  const name = controller.name;
  // NOTE store mark in to redux to provide correct watching of changes
  yield put(updateCSDMetaAction({ name, connected: false }));
  // NOTE important thing to prevent cancelation of subscriber channel
  if (controller.hasChannel()) {
    yield cancel(controller.getChannel(SECRET));
  }
  controller.setChannel();
}
// NOTE fix saga types overload fatal error
type SagaWatcher = (any: unknown) => unknown;
type SagaPayload = Controller<unknown, unknown>;
export const subscribeAction = createAction<SagaPayload>(`${SAGA_PREFIX}/SUBSCRIBE`);
export const unsubscribeAction = createAction<SagaPayload>(`${SAGA_PREFIX}/UNSUBSCRIBE`);
export function * sagas () {
  yield takeEvery<string>(subscribeAction.TYPE, forceCast<SagaWatcher>(subscribeSaga));
  yield takeEvery(unsubscribeAction.TYPE, forceCast<SagaWatcher>(unsubscribeSaga));
}

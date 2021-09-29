
// outsource dependencies
import { takeEvery, put, select, delay } from 'redux-saga/effects';

// local dependencies
import { create } from 'redux-saga-controller';
// import prepareController from 'redux-saga-controller';

// export const controller = prepareController(
//   {
//     initialize: 'init',
//     getSelf: 'test',
//     someAction: 'test',
//   },
//   function * () {
//     yield takeEvery(controller.action.initialize.TYPE, initializeSaga);
//     yield takeEvery(controller.action.getSelf.TYPE, getSelfSaga);
//   },
//   {
//     initialized: false,
//     disabled: true,
//     data: null
//   },
//   '¯\\_(ツ)_/¯'
// );

export const controller = create({
  prefix: '¯\\_(ツ)_/¯',
  actions:   {
    initialize: 'init',
    getSelf: 'test',
    someAction: 'test',
  },
  initial: {
    initialized: false,
    disabled: true,
    data: null
  },
  subscriber: function * () {
    yield takeEvery(controller.action.initialize.TYPE, initializeSaga);
    yield takeEvery(controller.action.getSelf.TYPE, getSelfSaga);
  },
});
// NOTE Example of usage redux sagas
function * initializeSaga ({ type, payload }) {
  // NOTE bring reducer to initial state before start initialization
  yield put(controller.action.clearCtrl());
  const { initialized } = yield select(controller.select);
  console.log(`%c ${type} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;'
      , '\n initialized:', initialized
    , '\n payload:', payload
  );
  // NOTE emulate request
  yield delay(3e3);
  const data = {
    age: 30,
    name: '',
    the: 'initail',
    request: 'data',
  };
  yield put(controller.action.updateCtrl({ data }));
  // NOTE emulate request
  yield delay(3e3);
  // NOTE update any property of entire controller reducer "IInitial"
  yield put(controller.action.updateCtrl({ initialized: true, disabled: false }));
}

function * getSelfSaga ({ type, payload }) {
  yield put(controller.action.updateCtrl({ disabled: true }));
  console.log(`%c ${type} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;'
    , '\n let assume its request ;):', payload
  );
  // NOTE emulate request
  yield delay(3e3);
  const data = {
    id: payload.id,
    name: 'John',
    age: 30,
  };
  // NOTE update any property of entire controller reducer
  yield put(controller.action.updateCtrl({ data, disabled: false }));
}

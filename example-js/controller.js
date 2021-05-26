
// outsource dependencies
import { takeEvery, put, select } from 'redux-saga/effects';

// local dependencies
import createController from '../src'; // Use line below

export const controller = createController(
  {
    INITIALIZE: 'init',
    getSelf: 'test',
    someAction: 'test',
  },
  function * () {
    yield takeEvery(controller.action.INITIALIZE.TYPE, initializeSaga);
    yield takeEvery(controller.action.getSelf.TYPE, getSelfSaga);
  },
  {
    initialized: false,
    disabled: false,
    data: {
      name: 'John',
      age: 30,
    }
  }
);

// NOTE Example of usage redux sagas
function * initializeSaga ({ type, payload }) {
  // NOTE bring reducer to initial state before start initialization
  yield put(controller.action.clearCtrl());

  const { initialized, data: { name } } = yield select(controller.select);

  console.log(`%c ${type} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;'
    , '\n payload:', payload
    , '\n foo:', payload.foo
    , '\n initialized:', initialized
    , '\n name:', name
  );
  // NOTE update any property of entire controller reducer "IInitial"
  yield put(controller.action.updateCtrl({ initialized: true }));
}

function * getSelfSaga ({ type, payload }) {
  console.log(`%c ${type} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;'
    , '\n let assume its request ;):', payload
  );
  // NOTE update any property of entire controller reducer
  yield put(controller.action.updateCtrl({ initialized: true }));
}


// outsource dependencies
import { takeEvery, put, select } from 'redux-saga/effects';

// local dependencies
import createController, { Controller, ActionCreators, ActionCreator } from '../src'; // Use line below

// NOTE IMPORTANT!
// You should add interface only of you will use select effect from redux-saga
// In all cases except select effect you don't need it
// It because redux-saga effect select return any time in all cases
interface IInitial {
  initialized: boolean;
  disabled: boolean;
  data: {
    name: string;
    age: number;
  }
}
// NOTE action payloads
interface InitializePayload {
  foo: number;
}
interface MostCommonActionPayload {
  id: number | string;
  name?: string;
}
// You should add interface for actions its only one way to define payload annotation
interface IActions extends ActionCreators<IInitial> {
  INITIALIZE: ActionCreator<InitializePayload>; // invalid action become to "initialize" <== actionCase("INITIALIZE")
  getSelf: ActionCreator<Partial<IInitial>>; // "getSelf" <= actionCase("GET_SELF")
  someAction: ActionCreator<MostCommonActionPayload>; // "someAction" <== actionCase("someAction")
}

export const controller:Controller<IActions, IInitial> = createController(
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
// NOTE Create Controller
// export const controller: Controller<IInitial, IActions> = prepareController({
//   initial: {
//     initialized: false,
//     disabled: false,
//     data: {
//       name: 'John',
//       age: 30,
//     }
//   }, // Setup initial data for redux state
//   prefix: 'root', // Controller name
//   types: ['INITIALIZE', 'GET_SELF', 'someAction'], // actionCase => ['initialize', 'getSelf']
//   subscriber: function * () {
//     yield takeEvery(controller.action.INITIALIZE.TYPE, initializeSaga);
//   }
// });

// NOTE Example of usage redux sagas
function * initializeSaga ({ type, payload } : { type: string, payload: InitializePayload }) {
  // NOTE bring reducer to initial state before start initialization
  yield put(controller.action.clearCtrl());

  const { initialized, data: { name } }: IInitial = yield select(controller.select);

  console.log(`%c ${type} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;'
    , '\n payload:', payload
    , '\n foo:', payload.foo
    , '\n initialized:', initialized
    , '\n name:', name
  );
  // NOTE update any property of entire controller reducer "IInitial"
  yield put(controller.action.updateCtrl({ initialized: true }));
}

function * getSelfSaga ({ type, payload } : { type: string, payload: InitializePayload }) {
  console.log(`%c ${type} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;'
    , '\n let assume its request ;):', payload
  );
  // NOTE update any property of entire controller reducer
  yield put(controller.action.updateCtrl({ initialized: true }));
}

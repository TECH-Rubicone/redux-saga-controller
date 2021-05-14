
// outsource dependencies
import { takeEvery, put, select } from 'redux-saga/effects';

// local dependencies
import createController, { Controller, ActionCreators, ActionCreator } from '../src'; // Use line below

// NOTE IMPORTANT!
// You should add interface only of you will use select effect from redux-saga
// In all cases except select effect you don't need it
// It because redux-saga effect select return any time in all cases
type UserData = {
  name: string;
  age: number;
  [key: string]: unknown
}
interface IInitial {
  initialized: boolean;
  disabled: boolean;
  data: UserData
}
// NOTE action payloads
interface InitializePayload {
  foo: number;
}
interface SomePayload {
  id: number | string;
  name?: string;
}
type GetSelfPayload = { id: string| number };
// You should add interface for actions its only one way to define payload annotation
interface IActions extends ActionCreators<IInitial> {
  INITIALIZE: ActionCreator<InitializePayload>;
  someAction: ActionCreator<SomePayload>;
  getSelf: ActionCreator<GetSelfPayload>;
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
      name: '',
      age: 0,
    }
  }
);

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

function * getSelfSaga ({ type, payload } : { type: string, payload: GetSelfPayload }) {
  const userData: UserData = { name: 'Bilbo', age: 130, id: payload.id };
  console.log(`%c ${type} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;'
    , '\n let assume its request ;):', payload
    , '\n userData:', userData
  );
  // NOTE Type '{ q: number; }' is missing the following properties from type 'UserData': name, age
  // yield put(controller.action.updateCtrl({ data: { q: 1 } }));
  // NOTE update any property of entire controller reducer
  yield put(controller.action.updateCtrl({ data: userData }));
}

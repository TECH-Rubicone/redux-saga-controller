
// outsource dependencies
import { Action } from 'redux';
import { takeEvery, put, select, delay } from 'redux-saga/effects';
import { Controller, ActionCreators, ActionCreator, create } from 'redux-saga-controller';
// import createController, { Controller, ActionCreators, ActionCreator } from 'redux-saga-controller';

// NOTE action shortcut
interface Act<Payload> extends Action {
  payload: Payload
}

// NOTE IMPORTANT!
// You should add interface only of you will use select effect from redux-saga
// In all cases except select effect you don't need it
// It because redux-saga effect select return "any" in all cases
type UserData = {
  name: string;
  age: number;
  [key: string]: unknown
}
interface IInitial {
  initialized: boolean;
  disabled: boolean;
  data: UserData | null
}
// NOTE action payloads
interface InitializePayload {
  some: string;
}
interface SomePayload {
  id: number | string;
  name?: string;
}
type GetSelfPayload = { id: string | number };
// You should add interface for actions its only one way to define payload annotation
interface IActions extends ActionCreators<IInitial> {
  initialize: ActionCreator<InitializePayload>;
  someAction: ActionCreator<SomePayload>;
  getSelf: ActionCreator<GetSelfPayload>;
}

// export const controller:Controller<IActions, IInitial> = createController(
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

export const controller:Controller<IActions, IInitial> = create({
  prefix: '¯\\_(ツ)_/¯',
  actions: ['initialize', 'getSelf'],
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
function * initializeSaga ({ type, payload } : Act<InitializePayload>) {
  // NOTE bring reducer to initial state before start initialization
  yield put(controller.action.clearCtrl());
  const { initialized }: IInitial = yield select(controller.select);
  console.log(`%c ${type} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;'
    , '\n let assume it`s initial request ;):', payload
    , '\n initialized:', initialized
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

function * getSelfSaga ({ type, payload } : Act<GetSelfPayload>) {
  yield put(controller.action.updateCtrl({ disabled: true }));
  console.log(`%c ${type} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;'
    , '\n let assume it`s getSlef request ;):', payload
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

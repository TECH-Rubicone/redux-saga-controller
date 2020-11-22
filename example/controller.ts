
// outsource dependencies
import { takeEvery, put, select } from 'redux-saga/effects';

// local dependencies
import { Controller, ControllerState } from '../src'; // Use line below
// import { Controller, ControllerState } from 'redux-saga-controller';

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

// NOTE Initial data for your redux state
const initial: IInitial = {
  initialized: false,
  disabled: false,
  data: {
    name: 'John',
    age: 30,
  }
};

// NOTE Create Controller
export const controller = new Controller({
  DEBUG: true, // Enable DEBUG Mode
  initial, // Setup initial data for redux state
  prefix: 'root', // Controller name
  types: ['initialize', 'getSelf'], // Types for which action creators will be generated
  subscriber: function * () {
    yield takeEvery(controller.TYPE.initialize, initializeSaga);
  }
});

export default controller;

// NOTE Example of usage redux sagas
function * initializeSaga ({ type, payload } : { type: string, payload: any }) {
  console.log(`%c ${type} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;'
    , '\n payload:', payload
  );

  ////////////////////////////
  // NOTE How use selectors //
  ////////////////////////////

  // NOTE Actual data - data with which selector works
  const actualState: IInitial = yield select(controller.selectorActual);
  console.log(actualState.data.name); // John
  // NOTE Initial data - initial data which you setup
  const initialState: IInitial = yield select(controller.selectorInitial);
  console.log(initialState.data.name); // John
  // NOTE isControllerConnected
  const isControllerConnected: boolean = yield select(controller.selectorConnected);
  console.log(isControllerConnected); // true | false
  // NOTE All data from controller
  const state: ControllerState<IInitial> = yield select(controller.selector);
  console.log(state.connected); // true | false
  console.log(state.actual.data.name); // John
  console.log(state.initial.data.name); // John

  //////////////////////////
  // NOTE How use actions //
  //////////////////////////

  // NOTE clearCtrl will setup actual to {}
  yield put(controller.action.clearCtrl());
  // NOTE will dispach an action getSelf
  // getSelf is equal to yield put({ type: controller.TYPE.getSelf })
  yield put(controller.action.getSelf());
  // NOTE it is partial update actual data object
  yield put(controller.action.updateCtrl({ initialized: true }));
}

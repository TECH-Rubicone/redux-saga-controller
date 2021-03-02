
// outsource dependencies
import { takeEvery, put, select } from 'redux-saga/effects';

// local dependencies
import { prepareController, InitialState, CtrlActionCreators, CtrlActionCreator, Controller } from '../src'; // Use line below

// NOTE IMPORTANT!
// You should add interface only of you will use select effect from redux-saga
// In all cases except select effect you don't need it
// It because redux-saga effect select return any time in all cases
interface IInitial extends InitialState {
  initialized: boolean;
  disabled: boolean;
  data: {
    name: string;
    age: number;
  }
}

interface IActions extends CtrlActionCreators {
  INITIALIZE: CtrlActionCreator;
  GET_SELF: CtrlActionCreator;
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
export const controller: Controller<IActions, IInitial> = prepareController({
  initial, // Setup initial data for redux state
  prefix: 'root', // Controller name
  types: ['INITIALIZE', 'GET_SELF'], // Types for which action creators will be generated
  subscriber: function * () {
    yield takeEvery(controller.action.INITIALIZE.TYPE, initializeSaga);
  }
});

controller.action.GET_SELF;

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
  const state: IInitial = yield select(controller.selector);
  console.log(state.connected); // true | false
  console.log(state.actual.data.name); // John
  console.log(state.initial.data.name); // John

  //////////////////////////
  // NOTE How use actions //
  //////////////////////////

  // NOTE clearCtrl will setup actual to {}
  yield put(controller.action.CLEAR_CTRL());
  // NOTE will dispach an action getSelf
  // getSelf is equal to yield put({ type: controller.TYPE.getSelf })
  yield put(controller.action.GET_SELF());
  // NOTE it is partial update actual data object
  yield put(controller.action.UPDATE_CTRL({ initialized: true }));
}

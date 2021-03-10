
// outsource dependencies
import { takeEvery, put, select } from 'redux-saga/effects';

// local dependencies
import { Controller, prepareController, CtrlActionCreators, CtrlActionCreator, CtrlPayload } from '../src'; // Use line below

import { Ctrl } from '../src/controller';

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

// NOTE IMPORTANT!
interface InitializePayload extends CtrlPayload {
  boo: number;
}
// You should add interface for actions its only one way to define payload annotation
interface IActions extends CtrlActionCreators<IInitial> {
  INITIALIZE: CtrlActionCreator<InitializePayload>;
  getSelf: CtrlActionCreator<Partial<IInitial>>;
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
export const controller: Controller<IInitial, IActions> = prepareController({
  initial, // Setup initial data for redux state
  prefix: 'root', // Controller name
  types: ['INITIALIZE', 'GET_SELF'], // Types for which action creators will be generated
  subscriber: function * () {
    yield takeEvery(controller.action.INITIALIZE.TYPE, initializeSaga);
  }
});
controller.initial.initialized;
controller.action.getSelf({ initialized: true, boo: 2 });
controller.action.INITIALIZE({ boo: 1 });
controller.action.updateCtrl({ disabled: false, initialized: 'hey strings not allowed *)' });
// controller.action.GET_SELF();
// controller.action.updateCtrl({ a: 1 });
// controller.action

//
// controller.action.updateCtrl();
// controller.action.updateCtrl.TYPE;
// controller.action.clearCtrl;
// // controller.getInitial();
// controller.getInitial().disabled;
// controller.action.INITIALIZE
// controller.selector
// controller.action


// export const ctrlNew = new Controller({
//   initial, // Setup initial data for redux state
//   name: 'root', // Controller name
//   types: ['INITIALIZE', 'GET_SELF'], // Types for which action creators will be generated
//   subscriber: function * subscriber () {
//     yield takeEvery(ctrlNew.action.INITIALIZE.TYPE, initializeSaga);
//   },
// });
// ctrlNew.getInitial().initialized;
// ctrlNew.action.GET_SELF;
// ctrlNew.getInitial();
// ctrlNew.action.updateCtrl({ a: 1 });
// ctrlNew.action

const ctrlOld = new Ctrl(
  {
    initial, // Setup initial data for redux state
    prefix: 'root', // Controller name
    types: ['INITIALIZE', 'GET_SELF'], // Types for which action creators will be generated
    subscriber: function * () {
      yield takeEvery(ctrlOld.action.INITIALIZE, initializeSaga);
    }
  }
);
ctrlOld.initial.initialized;
ctrlOld.action.INITIALIZE;
ctrlOld.action.UPDATE_CTRL({ a: 1 });


export default 1;


// NOTE Example of usage redux sagas
function * initializeSaga ({ type, payload } : { type: string, payload: any }) {
  console.log(`%c ${type} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;'
    , '\n payload:', payload
  );

  ////////////////////////////
  // NOTE How use selectors //
  ////////////////////////////

  // NOTE Actual data - data with which selector works
  const { initialized, data }: IInitial = yield select(ctrlOld.selector);
  console.log(data.name); // John

  //////////////////////////
  // NOTE How use actions //
  //////////////////////////

  // NOTE clearCtrl will setup actual to {}
  yield put(ctrlOld.action.CLEAR_CTRL());
  // NOTE will dispach an action getSelf
  // getSelf is equal to yield put({ type: controller.TYPE.getSelf })
  yield put(ctrlOld.action.GET_SELF());
  // NOTE it is partial update actual data object
  yield put(ctrlOld.action.UPDATE_CTRL({ initialized: true }));
}


// outsource dependencies
import { takeEvery, put, select } from 'redux-saga/effects';

// local dependencies
import { Controller } from '../src'; // Use line below

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
// You should add interface for actions its only one way to define payload annotation
interface Actions {
  INITIALIZE: (payload: Partial<IInitial>) => undefined;
  getSelf: (payload: Partial<IInitial>) => undefined;
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
// export const controller: Controller<IInitial, 'INITIALIZE' | 'GET_SELF'> = prepareController({
//   initial, // Setup initial data for redux state
//   prefix: 'root', // Controller name
//   types: ['INITIALIZE', 'GET_SELF'], // Types for which action creators will be generated
//   subscriber: function * () {
//     yield takeEvery(controller.action.INITIALIZE.TYPE, initializeSaga);
//   }
// });
//
// controller.action.updateCtrl();
// controller.action.updateCtrl.TYPE;
// controller.action.clearCtrl;
// // controller.getInitial();
// controller.getInitial().disabled;
// controller.action.INITIALIZE
// controller.selector
// controller.action


export const controller = new Controller({
  initial, // Setup initial data for redux state
  prefix: 'root', // Controller name
  types: ['INITIALIZE', 'GET_SELF'], // Types for which action creators will be generated
  subscriber: function * subscriber () {
    yield takeEvery(controller.action.INITIALIZE.TYPE, initializeSaga);
  },
});
controller.action.GET_SELF
controller.getInitial()


const c = new Ctrl(
  {
    initial, // Setup initial data for redux state
    prefix: 'root', // Controller name
    types: ['INITIALIZE', 'GET_SELF'], // Types for which action creators will be generated
    subscriber: function * () {
      yield takeEvery(c.action.INITIALIZE, initializeSaga);
    }
  }
);
c.action.INITIALIZE


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
  const { initialized, data }: IInitial = yield select(controller.selector);
  console.log(data.name); // John

  //////////////////////////
  // NOTE How use actions //
  //////////////////////////

  // NOTE clearCtrl will setup actual to {}
  yield put(controller.action.clearCtrl());
  // NOTE will dispach an action getSelf
  // getSelf is equal to yield put({ type: controller.TYPE.getSelf })
  yield put(controller.action.GET_SELF());
  // NOTE it is partial update actual data object
  yield put(controller.action.updateCtrl({ initialized: true }));
}

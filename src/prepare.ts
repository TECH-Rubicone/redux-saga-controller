
// outsource dependencies
import { Task } from 'redux-saga';

// local dependencies
import { Subscriber } from './saga';
import { Selector, createSelectorActualCSD } from './reducer';
import { createClearCtrl, createUpdateCtrl, createAction } from './actions';
import { ERROR, SECRET, forceCast, hash, isSubscriber, isPlainObject } from './constant';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActAnnotation= Partial<any>;
type PrivateData<Initial> = {
  channel?: Task;
  initial: Initial;
  subscriber: Subscriber;  // *^ ...implicitly call...  Subscriber,
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Controller<Actions = any, Initial = any> = {
  id: string,
  action: Actions,
  select: Selector<Initial>,
  [SECRET]: PrivateData<Initial>
}
export function prepareController<Actions, Initial> (
  // TODO how to implement type to say they useful ? typescript sucks ¯\_(ツ)_/¯
  actions: ActAnnotation,
  subscriber: Subscriber, // *^ ...implicitly...,
  initial: Initial,
  prefix = ''
): Controller<Actions, Initial> {

  if (!actions || !isPlainObject(actions)) {
    throw new Error(ERROR.PREPARE_ACTIONS_REQUIRED());
  }
  if (!subscriber || !isSubscriber(subscriber)) {
    throw new Error(ERROR.PREPARE_SUBSCRIBER_REQUIRED());
  }
  if (!initial || !isPlainObject(initial)) {
    throw new Error(ERROR.PREPARE_INITIAL_REQUIRED());
  }
  const id = prefix ? `${prefix}-state` : `${hash()}-state`;

  const action: ActAnnotation = {};
  // NOTE use same names as in annotation to provide auto suggestions for pure js also
  for (const name in actions) {
    // NOTE provide ability to setup readable action names within redux devtools
    action[name] = createAction(`@${id}/${actions[name]}` as const);
  }
  // NOTE setup system action
  action.clearCtrl = createClearCtrl<Initial>(id, initial);
  action.updateCtrl = createUpdateCtrl(id);

  return {
    id,
    // NOTE fuck typescript to allow setup action interface outside even if it will be wrong ;)
    action: forceCast<Actions>(action),
    select: createSelectorActualCSD(id, initial),
    [SECRET]: {
      initial,
      subscriber,
    }
  };
}

export function create<Actions, Initial> ({ actions, subscriber, initial, prefix = 'c' } : {
  actions: string[] | ActAnnotation,
  prefix?: string
  initial: Initial,
  subscriber: Subscriber,
}): Controller<Actions, Initial> {
  if (Array.isArray(actions)) {
    const tmp: ActAnnotation = {};
    for (const name of actions) {
      tmp[name] = name;
    }
    actions = tmp;
  } else if (!actions || !isPlainObject(actions)) {
    throw new Error(ERROR.PREPARE_ACTIONS_REQUIRED());
  }
  return prepareController(actions, subscriber, initial, prefix);
}

/**
 * rules to selecting controller private data
 */
export function getControllerSubscriber<Actions, Initial> (controller: Controller<Actions, Initial>) {
  return controller[SECRET].subscriber;
}
export function getControllerInitialState<Actions, Initial> (controller: Controller<Actions, Initial>) {
  return controller[SECRET].initial;
}
export function getControllerChannel<Actions, Initial> (controller: Controller<Actions, Initial>) {
  return controller[SECRET].channel;
}

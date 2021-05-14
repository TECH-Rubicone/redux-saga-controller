
// outsource dependencies
import { Task } from 'redux-saga';

// local dependencies
import { Subscriber } from './saga';
import { Selector, createSelectorActualCSD } from './reducer';
import { createClearCtrl, createUpdateCtrl, createAction } from './actions';
import { SECRET, forceCast, hash, isSubscriber, isPlainObject } from './constant';


type PrivateData<Initial> = {
  channel?: Task;
  initial: Initial;
  subscriber: Subscriber;  // *^ ...implicitly call...  Subscriber,
};
export type Controller<Actions, Initial> = {
  id: string,
  action: Actions,
  select: Selector<Initial>,
  [SECRET]: PrivateData<Initial>
}

export function prepareController<Actions, Initial> (
  actions: Partial<unknown>,
  subscriber: Subscriber, // *^ ...implicitly...,
  initial: Initial,
  prefix = ''
): Controller<Actions, Initial> {

  if (!actions || !isPlainObject(actions)) {
    throw new Error('"Actions" is required and should be a plain object (first argument)');
  }
  if (!subscriber || !isSubscriber(subscriber)) {
    throw new Error('"Subscriber" is required and should be a saga generator (second argument)');
  }
  if (!initial || !isPlainObject(initial)) {
    throw new Error('"Initial" is required and should be a plain object (third argument)');
  }
  const id = `${prefix ? `${prefix}-` : ''}${hash()}`;

  /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
  const action: Partial<any> = {};
  // NOTE use same names as in annotation to provide auto suggestions for pure js also
  for (const name in actions) {
    // NOTE provide ability to setup readable action names within redux devtools
    action[name] = createAction(`@${id}/${name}`);
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


// outsource dependencies
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// local dependencies
import { createSelectorIsConnected } from './reducer';
import { Controller, getControllerInitialState } from './prepare';
import { removeCSDAction, createCSDAction, subscribeAction, unsubscribeAction } from './actions';

// private HOOK
export const useReducerSubscribe = <Actions, Initial>(controller: Controller<Actions, Initial>) : null => {
  const id = controller.id;
  const dispatch = useDispatch();
  const initial: Initial = getControllerInitialState(controller);
  const remove = useCallback(() => { dispatch(removeCSDAction({ id })); }, [id, dispatch]);
  const create = useCallback(() => dispatch(createCSDAction({ id, data: initial })), [initial, id, dispatch]);
  useEffect(() => create() && remove, [create, remove]);
  return null;
};

// HOOK
export const useSubscribe = <Actions, Initial>(controller: Controller<Actions, Initial>): boolean => {
  useReducerSubscribe(controller);
  const dispatch = useDispatch();
  const connected = useSelector(createSelectorIsConnected(controller.id));
  const subscribe = useCallback(() => dispatch(subscribeAction(controller)), [controller, dispatch]);
  const unsubscribe = useCallback(() => { dispatch(unsubscribeAction(controller)); }, [controller, dispatch]);
  useEffect(() => subscribe() && unsubscribe, [subscribe, unsubscribe]);
  return connected;
};

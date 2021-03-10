
// outsource dependencies
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// local dependencies
import { Controller } from './prepare';
import { unsubscribeAction, subscribeAction } from './saga';
import { removeCSDAction, createCSDAction, selectIsConnectedCSD } from './reducer';

// private HOOK
const useReducerSubscribe = <Initial, Actions>(controller: Controller<Initial, Actions>) : null => {
  const name = controller.name;
  const initial: Initial = controller.initial;
  const dispatch = useDispatch();
  const remove = useCallback(() => { dispatch(removeCSDAction({ name })); }, [name, dispatch]);
  const create = useCallback(() => dispatch(createCSDAction({ name, initial })), [initial, name, dispatch]);
  useEffect(() => create() && remove, [create, remove]);
  return null;
};

// HOOK
export const useSubscribe = <Initial, Actions>(controller: Controller<Initial, Actions>): boolean => {
  useReducerSubscribe(controller);
  const dispatch = useDispatch();
  const connected = useSelector(selectIsConnectedCSD(controller.name));
  const subscribe = useCallback(() => dispatch(subscribeAction(controller)), [controller, dispatch]);
  const unsubscribe = useCallback(() => { dispatch(unsubscribeAction(controller)); }, [controller, dispatch]);
  useEffect(() => subscribe() && unsubscribe, [subscribe, unsubscribe]);
  return connected;
};

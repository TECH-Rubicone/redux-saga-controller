
// outsource dependencies
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// local dependencies
import { ControllerAnnotation } from './prepare';
import { unsubscribeAction, subscribeAction } from './saga';
import { removeCSDAction, createCSDAction, selectIsConnectedCSD } from './reducer';

// private HOOK
const useReducerSubscribe = <I>(controller: ControllerAnnotation<I>) : null => {
  const name = controller.name;
  const initial = controller.getInitial();
  const dispatch = useDispatch();
  const remove = useCallback(() => {
    dispatch(removeCSDAction({ name }));
  }, [name, dispatch]);
  const create = useCallback(() => dispatch(createCSDAction({ name, initial })), [initial, name, dispatch]);
  useEffect(() => create() && remove, [create, remove]);
  return null;
};

// HOOK
export const useSubscribe = <I>(controller: ControllerAnnotation<I>) => {
  useReducerSubscribe(controller);
  const dispatch = useDispatch();
  const connected = useSelector(selectIsConnectedCSD<I>(controller.name));
  const subscribe = useCallback(() => dispatch(subscribeAction(controller)), [controller, dispatch]);
  const unsubscribe = useCallback(() => { dispatch(unsubscribeAction(controller)); }, [controller, dispatch]);
  useEffect(() => subscribe() && unsubscribe, [subscribe, unsubscribe]);
  return connected;
};

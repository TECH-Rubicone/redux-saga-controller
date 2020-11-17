
// outsource dependencies
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// local dependencies
import { Controller } from './controller';
import { unsubscribeAction, subscribeAction } from './saga';
import { removeCSDAction, createCSDAction, selectMetaCSD } from './reducer';

// private HOOK
const useReducerSubscribe = <T extends string, I>(controller: Controller<T, I>) : null => {
  const name = controller.name;
  const initial = controller.initial;
  const dispatch = useDispatch();
  const remove = useCallback(() => dispatch(removeCSDAction(name)), [name, dispatch]);
  const create = useCallback(() => dispatch(createCSDAction(name, initial)), [initial, name, dispatch]);
  // TODO Simplify next record
  useEffect(() => {
    create();
    return () => {
      remove();
    };
  }, [create, remove]);
  return null;
};

// HOOK
export const useSubscribe = <T extends string, I>(controller: Controller<T, I>) : boolean => {
  useReducerSubscribe(controller);
  const dispatch = useDispatch();
  const meta = useSelector(selectMetaCSD(controller.name));
  const subscribe = useCallback(() => dispatch(subscribeAction(controller)), [controller, dispatch]);
  const unsubscribe = useCallback(() => dispatch(unsubscribeAction(controller)), [controller, dispatch]);
  // TODO Simplify next record
  useEffect(() => {
    subscribe();
    return () => {
      unsubscribe();
    };
  }, [subscribe, unsubscribe]);
  return meta.connected;
};

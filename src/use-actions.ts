
// outsource dependencies
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';

// local dependencies
import { Controller } from './index';
import { DefaultActions } from './controller';

// HOOK
export const useActions = <T extends string, I>(controller: Controller<T, I>) => {
  const dispatch = useDispatch();
  const actionCreators = controller.action;
  return useMemo(() => {
    const cache = {} as Record<T | DefaultActions, (payload?: unknown) => void>;
    for (const name in actionCreators) {
      if (actionCreators.hasOwnProperty(name)) {
        const action = actionCreators[name as T | DefaultActions];
        cache[name as T | DefaultActions] = (payload?: unknown): void => {
          dispatch(action(payload));
        };
      }
    }
    return cache;
  }, [actionCreators, dispatch]);
};

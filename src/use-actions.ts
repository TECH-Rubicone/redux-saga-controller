
// outsource dependencies
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';

// local dependencies
import { Controller } from './index';

// HOOK
export const useActions = <T extends string, I>(controller: Controller<T, I>) => {
  const dispatch = useDispatch();
  const actionCreators = controller.action;
  return useMemo(() => {
    const cache = {} as Record<string, (payload?: unknown) => void>;
    for (const name in actionCreators) {
      if (actionCreators.hasOwnProperty(name)) {
        const action = actionCreators[name as T];
        cache[name] = payload => {
          dispatch(action(payload));
        };
      }
    }
    return cache;
  }, [actionCreators, dispatch]);
};

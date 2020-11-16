// NOTE -

// outsource dependencies
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';

// local dependencies
import { Controller } from './index';

/* HOOK */
export const useActions = <T extends string, I>(controller: Controller<T, I>) => {
  const dispatch = useDispatch();
  const actionCreators = controller.action;
  return useMemo(() => {
    const cache = {};
    // TODO prepare actions
    Object.keys(actionCreators).map(actionName => {
      const action = actionCreators[actionName];
      return cache[actionName] = payload => dispatch(action(payload));
    });
    return cache;
  }, [actionCreators, dispatch]);
};

export default useActions;

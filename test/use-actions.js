
// outsource dependencies
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';

// local dependencies

/* HOOK */
export default controller => {
  const dispatch = useDispatch();
  const actionCreators = controller.action;
  return useMemo(() => {
    const cache = {};
    Object.keys(actionCreators).map(actionName => {
      const action = actionCreators[actionName];
      return cache[actionName] = payload => dispatch(action(payload));
    });
    return cache;
  }, [actionCreators, dispatch]);
};

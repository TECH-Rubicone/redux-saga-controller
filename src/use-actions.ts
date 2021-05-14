
// outsource dependencies
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';

// local dependencies
import { Controller } from './prepare';
import { forceCast, getKeys } from './constant';

// HOOK
export const useActions = <Actions, Initial>(controller: Controller<Actions, Initial>): Actions => {
  const dispatch = useDispatch();
  const actions: Actions = controller.action;
  return useMemo(() => {
    const wrappedActions = {} as Record<keyof Actions, Actions[keyof Actions]>;
    getKeys(actions).map((name) => {
      const action = actions[name];
      wrappedActions[name] = forceCast<Actions[keyof Actions]>(<Payload>(payload: Payload) => {
        if (typeof action === 'function') {
          dispatch(action(payload));
        }
      });
    });
    return forceCast<Actions>(wrappedActions);
  }, [actions, dispatch]);
};

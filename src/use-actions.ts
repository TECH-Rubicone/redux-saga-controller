
// outsource dependencies
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';

// local dependencies
import { forceCast } from './constant';
import { Controller } from './prepare';

// HOOK
export const useActions = <Actions, Initial>(controller: Controller<Actions, Initial>): Actions => {
  const dispatch = useDispatch();
  const actions: Actions = controller.action;
  return useMemo(() => {
    const wrappedActions = {};
    for (const name in actions) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      wrappedActions[name] = payload => dispatch(actions[name](payload));
    }
    // const wrappedActions = {} as Record<keyof Actions, Actions[keyof Actions]>;
    // const wrappedActions = {} as Record<keyof Actions, Actions[keyof Actions]>;
    // getKeys(actions).map((name) => {
    //   const action = actions[name];
    //   wrappedActions[name] = forceCast<Actions[keyof Actions]>(<Payload>(payload: Payload) => {
    //     if (typeof action === 'function') {
    //       dispatch(action(payload));
    //     }
    //   });
    // });
    return forceCast<Actions>(wrappedActions);
  }, [actions, dispatch]);
  // const dispatch = useDispatch();
  // const actions: Actions = controller.action;
  // return useMemo(() => {
  //   const wrappedActions = {} as Record<keyof Actions, Actions[keyof Actions]>;
  //   getKeys(actions).map((name) => {
  //     const action = actions[name];
  //     wrappedActions[name] = forceCast<Actions[keyof Actions]>(<Payload>(payload: Payload) => {
  //       if (typeof action === 'function') {
  //         dispatch(action(payload));
  //       }
  //     });
  //   });
  //   return forceCast<Actions>(wrappedActions);
  // }, [actions, dispatch]);
};

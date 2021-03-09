
// outsource dependencies
import { useMemo } from 'react';
import { ActionCreator } from 'redux';
import { useDispatch } from 'react-redux';

// local dependencies
import { Controller } from './prepare';
import { CtrlActionCreators, CtrlPayload, CtrlAction, forceCast } from './type.spec';

type InUseActions<I = ActionCreator<CtrlAction>> = {
  [ctrl: string]: I;
} & {
  clearCtrl: ActionCreator<CtrlAction>;
  updateCtrl: ActionCreator<CtrlAction>;
}

// HOOK
export const useActions = <Actions, Initial>(controller: Controller<Actions, Initial>) => {
  const dispatch = useDispatch();
  const list = controller.action;
  return useMemo(() => {
    const cache = {} as InUseActions;
    for (const name in list) {
      // if (list.hasOwnProperty(name)) {
        const action = list[name];
        cache[name] = (payload?: CtrlPayload) => {
          if (typeof payload !== 'object') {
            payload = {};
          }
          return dispatch(action(payload));
        };
      // }
    }
    return cache;
  }, [list, dispatch]);
};

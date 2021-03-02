
// outsource dependencies
import { useMemo } from 'react';
import { ActionCreator } from 'redux';
import { useDispatch } from 'react-redux';

// local dependencies
import { CtrlAction, CtrlPayload } from './reducer';
import { ControllerAnnotation, CtrlActionCreators } from './prepare';

type InUseActions<I = ActionCreator<CtrlAction>> = {
  [ctrl: string]: I;
} & {
  clearCtrl: ActionCreator<CtrlAction>;
  updateCtrl: ActionCreator<CtrlAction>;
}

// HOOK
export const useActions = <I extends string>(controller: ControllerAnnotation) => {
  const dispatch = useDispatch();
  const list: CtrlActionCreators = controller.action;
  return useMemo(() => {
    const cache = {} as InUseActions;
    for (const name in list) {
      if (list.hasOwnProperty(name)) {
        const action = list[name];
        cache[name as I] = (payload?: CtrlPayload) => {
          if (typeof payload !== 'object') {
            payload = {};
          }
          return dispatch(action(payload));
        };
      }
    }
    return cache;
  }, [list, dispatch]);
};

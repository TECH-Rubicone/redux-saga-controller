
// outsource dependencies
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';

// local dependencies
// import { Controller } from './index';
import { CtrlSystemActionTypes } from './type.spec';

// HOOK
// export const useActions = <T extends string, I>(controller: Controller<T, I>) => {
//   const dispatch = useDispatch();
//   const actionCreators = controller.action;
//   return useMemo(() => {
//     const cache = {} as Record<T | CtrlSystemActionTypes, (payload?: unknown) => void>;
//     for (const name in actionCreators) {
//       if (actionCreators.hasOwnProperty(name)) {
//         const action = actionCreators[name as T | CtrlSystemActionTypes];
//         cache[name as T | CtrlSystemActionTypes] = (payload?: unknown): void => {
//           dispatch(action(payload));
//         };
//       }
//     }
//     return cache;
//   }, [actionCreators, dispatch]);
// };

export function useActions () {
  return true;
}

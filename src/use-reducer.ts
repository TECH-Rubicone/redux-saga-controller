
// outsource dependencies
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

// local dependencies
import { selectActualCSD } from './reducer';
import { ControllerAnnotation } from './prepare';

// HOOK
export const useReducer = <I>(controller: ControllerAnnotation<I>): I => {
  const name = controller.name;
  const initial = controller.getInitial();
  const actual = useSelector(selectActualCSD(name));
  return useMemo(() => Object.assign({}, initial, actual), [initial, actual]);
};

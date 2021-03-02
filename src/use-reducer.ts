
// outsource dependencies
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

// local dependencies
import { Controller } from './prepare';
import { selectActualCSD } from './reducer';

// HOOK
export const useReducer = <Actions, Initial>(controller: Controller<Actions, Initial>): Initial => {
  const name = controller.name;
  const initial: Initial = controller.getInitial();
  const actual: Initial = useSelector(selectActualCSD<Initial>(name));
  return useMemo(() => Object.assign({}, initial, actual), [initial, actual]);
};

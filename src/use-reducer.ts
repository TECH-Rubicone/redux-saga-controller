
// outsource dependencies
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

// local dependencies
import { Controller } from './prepare';
import { selectActualCSD } from './reducer';

// HOOK
export const useReducer = <Initial, Actions>(controller: Controller<Initial, Actions>): Initial => {
  const name = controller.name;
  const initial: Initial = controller.initial;
  const actual = useSelector(selectActualCSD<Initial>(name));
  return useMemo(() => Object.assign({}, initial, actual), [initial, actual]);
};

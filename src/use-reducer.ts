
// outsource dependencies
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

// local dependencies
import { Controller } from './controller';
import { selectActualCSD } from './reducer';

// HOOK
export const useReducer = <T extends string, I>(controller: Controller<T, I>) : I => {
  const name = controller.name;
  const initial = controller.initial;
  const actual = useSelector(selectActualCSD(name));
  return useMemo(() => Object.assign({}, initial, actual), [initial, actual]);
};

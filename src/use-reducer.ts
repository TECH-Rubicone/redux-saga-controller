// NOTE +

// outsource dependencies
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

// local dependencies
import { selectCSD } from './reducer';
import { Controller } from './controller';

// HOOK
export const useReducer = <T extends string, I>(controller: Controller<T, I>) : I => {
  const name = controller.name;
  const initial = controller.initial;
  const actual = useSelector(selectCSD(name));
  return useMemo(() => ({ ...initial, ...actual }), [initial, actual]);
};

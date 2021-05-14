
// outsource dependencies
import { useSelector } from 'react-redux';

// local dependencies
import { SECRET } from './constant';
import { Controller } from './prepare';
import { createSelectorActualCSD } from './reducer';

// HOOK
export const useReducer = <Actions, Initial>(controller: Controller<Actions, Initial>): Initial => {
  const id = controller.id;
  const initial: Initial = controller[SECRET].initial;
  return useSelector(createSelectorActualCSD<Initial>(id, initial));
};

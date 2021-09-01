
// outsource dependencies
import { useSelector } from 'react-redux';

// local dependencies
import { createSelectorActualCSD } from './reducer';
import { Controller, getControllerInitialState } from './prepare';

// HOOK
export const useReducer = <Actions, Initial>(controller: Controller<Actions, Initial>): Initial => {
  const id = controller.id;
  const initial: Initial = getControllerInitialState(controller);
  return useSelector(createSelectorActualCSD<Initial>(id, initial));
};

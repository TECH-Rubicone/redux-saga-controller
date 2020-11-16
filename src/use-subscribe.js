
// outsource dependencies
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// local dependencies
import { unsubscribeAction, subscribeAction } from './saga';
import { removeCSDAction, createCSDAction, selectMetaCSD } from './reducer';

/* private HOOK */
const useReducerSubscribe = controller => {
  const name = controller.name;
  const initial = controller.initial;
  const dispatch = useDispatch();
  const remove = useCallback(() => dispatch(removeCSDAction(name)), [name, dispatch]);
  const create = useCallback(() => dispatch(createCSDAction(name, initial)), [initial, name, dispatch]);
  useEffect(() => create() && remove, [create, remove]);
  return null;
};

/* HOOK */
export default controller => {
  useReducerSubscribe(controller);
  const dispatch = useDispatch();
  const meta = useSelector(selectMetaCSD(controller.name));
  const subscribe = useCallback(() => dispatch(subscribeAction(controller)), [controller, dispatch]);
  const unsubscribe = useCallback(() => dispatch(unsubscribeAction(controller)), [controller, dispatch]);
  useEffect(() => subscribe() && unsubscribe, [subscribe, unsubscribe]);
  return meta.connected;
};

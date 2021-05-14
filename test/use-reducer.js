
// outsource dependencies
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

// local dependencies
import { selectCSD } from './reducer';

/* HOOK */
export default controller => {
  const name = controller.name;
  const initial = controller.initial;
  const actual = useSelector(selectCSD(name));
  // NOTE deep cloning possible, but it will break down RX methodology
  return useMemo(() => ({ ...initial, ...actual }), [initial, actual]);
};

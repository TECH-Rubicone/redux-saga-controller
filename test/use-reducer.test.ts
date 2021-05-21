
// outsource dependencies
import { act } from '@testing-library/react-hooks';

// local dependencies
import { SECRET } from '../src/constant';
import { useReducer } from '../src/use-reducer';
import { Controller, prepareController } from '../src';
import { store, renderHookWithRedux } from './test.mock';

// configure
const ctrl: Controller = prepareController(
  { test: 'jest-test-reducer-action' },
  function * subscriber () { /* NOTE do nothing */ },
  { test: true },
);

describe('Controller "useReducer"', () => {
  it('should exist', () => {
    expect(useReducer).toBeInstanceOf(Function);
  });

  it('should care initial', () => {
    const { result } = renderHookWithRedux(() => useReducer(ctrl));

    expect(result.current).toEqual(ctrl[SECRET].initial);
  });

  it('should watch updates "CSD" store', () => {
    const { result } = renderHookWithRedux(() => useReducer(ctrl));
    const update = { update: 'test1', more: 'values' };
    const expected = Object.assign({}, ctrl[SECRET].initial, update);

    act(() => {
      store.dispatch(ctrl.action.updateCtrl(update));
    });
    expect(result.current).toEqual(expected);
  });
});

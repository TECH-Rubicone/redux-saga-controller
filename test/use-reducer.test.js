
// outsource dependencies
import React from 'react';
import { act } from '@testing-library/react-hooks';

// local dependencies
import useReducer from './use-reducer';
import { testCtrl, store, renderHookWithRedux } from './test.mock';

describe('Controller "useReducer"', () => {

  it('should exist', () => {
    expect(useReducer).toBeInstanceOf(Function);
  });

  it('should care initial', () => {
    const { result } = renderHookWithRedux(() => useReducer(testCtrl));

    expect(result.current).toEqual(testCtrl.initial);
  });

  it('should watch updates "CSD" store', () => {

    const { result } = renderHookWithRedux(() => useReducer(testCtrl));
    const update = { update: 'test1', more: 'values' };
    const expected = Object.assign({}, testCtrl.initial, update);

    act(() => {
      store.dispatch(testCtrl.action.updateCtrl(update));
    });
    expect(result.current).toEqual(expected);
  });
});

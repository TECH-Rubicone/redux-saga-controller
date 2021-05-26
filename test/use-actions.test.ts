
// outsource dependencies
import React from 'react';
import { renderHook } from '@testing-library/react-hooks';

// local dependencies
import { useActions } from '../src/use-actions';
import { Controller, prepareController } from '../src';

// configure
const mockDispatch = jest.fn().mockImplementation(a => a);
jest.mock('react-redux', () => ({ useDispatch: () => mockDispatch }));
const actionsAnnotation = {
  test0: 'jest-test-reducer-action-0',
  test1: 'jest-test-reducer-action-1',
  test2: 'jest-test-reducer-action-2',
};
const ctrl: Controller = prepareController(
  actionsAnnotation,
  function * subscriber () { /* NOTE do nothing */ },
  { test: true },
);

describe('Controller "useActions"', () => {
  it('should exist', () => {
    expect(useActions).toBeInstanceOf(Function);
  });

  it('should prepare to use controller "actions"', () => {
    const { result } = renderHook(() => useActions(ctrl));
    for (const actionName in actionsAnnotation) {
      expect(result.current[actionName]).toEqual(expect.any(Function));
    }
  });

  it('should fire custom "actions" using right schema', () => {
    const { result } = renderHook(() => useActions(ctrl));
    Object.keys(actionsAnnotation).map((actionName, index) => {
      const action = result.current[actionName];
      const actionData = { type: '😜', index };
      expect(mockDispatch).toBeCalledTimes(index);
      expect(action).toBeInstanceOf(Function);
      expect(action(actionData)).toEqual(
        expect.objectContaining({
          // @ts-ignore
          type: expect.stringContaining(actionsAnnotation[actionName]),
          payload: actionData,
        })
      );
      expect(mockDispatch).toBeCalledTimes(index + 1);
    });
  });
});

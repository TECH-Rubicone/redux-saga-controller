
// outsource dependencies
import React from 'react';
import { renderHook } from '@testing-library/react-hooks';

// local dependencies
import useActions from './use-actions';
import { testCtrl, testTypes as types, formattedActionNames } from './test.mock';

// configure
const mockDispatch = jest.fn().mockImplementation(a => a);
jest.mock('react-redux', () => ({ useDispatch: () => mockDispatch }));

describe('Controller "useActions"', () => {

  it('should exist', () => {
    expect(useActions).toBeInstanceOf(Function);
  });

  it('should prepare to use controller "actions"', () => {
    const { result } = renderHook(() => useActions(testCtrl));
    expect(result.current).toEqual(
      expect.objectContaining({
        clearCtrl: expect.any(Function),
        updateCtrl: expect.any(Function),
        [formattedActionNames[0]]: expect.any(Function),
        [formattedActionNames[1]]: expect.any(Function),
        [formattedActionNames[2]]: expect.any(Function),
      })
    );
  });

  it('should fire custom "actions" using right schema', () => {
    const { result } = renderHook(() => useActions(testCtrl));
    formattedActionNames.map((actionName, index) => {
      const action = result.current[actionName];
      const actionData = { type: '😜', index };
      expect(mockDispatch).toBeCalledTimes(index);
      expect(action).toBeInstanceOf(Function);
      expect(action(actionData)).toEqual(
        expect.objectContaining({
          type: `@${testCtrl.name}/${types[index]}`,
          payload: actionData,
        })
      );
      expect(mockDispatch).toBeCalledTimes(index + 1);
    });
  });
});

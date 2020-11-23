
// outsource dependencies
import React from 'react';
import { useSelector } from 'react-redux';
import { renderHook, act } from '@testing-library/react-hooks';

// local dependencies
import { testCtrl } from './test.mock';
import { unsubscribeAction, subscribeAction } from './saga';
import useSubscribe, { useReducerSubscribe } from './use-subscribe';
import { removeCSDAction, createCSDAction, selectMetaCSD } from './reducer';

// configure
const mockDispatch = jest.fn().mockImplementation(a => a);
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));

describe('Controller "useSubscribe"', () => {

  it('should exist', () => {
    expect(useSubscribe).toBeInstanceOf(Function);
    expect(useReducerSubscribe).toBeInstanceOf(Function);
  });

  it('should create/remove CSD store', () => {
    const { unmount } = renderHook(() => useReducerSubscribe(testCtrl));

    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith(createCSDAction(testCtrl.name, testCtrl.initial));

    act(() => {
      mockDispatch.mockClear();
      unmount();
    });

    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith(removeCSDAction(testCtrl.name));
  });

  it('should subscribe/unsubscribe CSD sagas', () => {
    mockDispatch.mockClear();
    useSelector.mockClear();
    const { unmount } = renderHook(() => useSubscribe(testCtrl));

    expect(mockDispatch).toBeCalledTimes(2);
    // NOTE first from "useReducerSubscribe"
    // expect(mockDispatch.mock.calls[0][0]).toEqual(createCSDAction(testCtrl.name, testCtrl.initial));
    expect(mockDispatch.mock.calls[1][0]).toEqual(subscribeAction(testCtrl));

    expect(useSelector).toBeCalledTimes(1);
    // NOTE compare bind functions
    expect(String(useSelector.mock.calls[0][0])).toEqual(String(selectMetaCSD(testCtrl.name)));

    act(() => {
      mockDispatch.mockClear();
      useSelector.mockClear();
      unmount();
    });

    expect(mockDispatch).toBeCalledTimes(2);
    // NOTE first from "useReducerSubscribe"
    expect(mockDispatch.mock.calls[0][0]).toEqual(removeCSDAction(testCtrl.name));
    expect(mockDispatch.mock.calls[1][0]).toEqual(unsubscribeAction(testCtrl));
  });

});

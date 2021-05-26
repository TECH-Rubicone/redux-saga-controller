
// outsource dependencies
import { useSelector } from 'react-redux';
import { renderHook, act } from '@testing-library/react-hooks';

// local dependencies
import { SECRET, forceCast } from '../src/constant';
import { Controller, prepareController } from '../src';
import { createSelectorIsConnected } from '../src/reducer';
import { useSubscribe, useReducerSubscribe } from '../src/use-subscribe';
import { createCSDAction, removeCSDAction, subscribeAction, unsubscribeAction } from '../src/actions';

// configure
const mockedUseSelector = forceCast<jest.MockedFunction<typeof useSelector>>(useSelector).mockClear();
const mockDispatch = jest.fn().mockImplementation(a => a);
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));
const ctrl: Controller = prepareController(
  { test: 'jest-test-reducer-action' },
  function * subscriber () { /* NOTE do nothing */ },
  { test: true },
);

describe('Controller "useSubscribe"', () => {

  it('should exist', () => {
    expect(useSubscribe).toBeInstanceOf(Function);
    expect(useReducerSubscribe).toBeInstanceOf(Function);
  });

  it('should create/remove CSD store', () => {
    const { unmount } = renderHook(() => useReducerSubscribe(ctrl));

    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith(createCSDAction({ id: ctrl.id, data: ctrl[SECRET].initial }));

    act(() => {
      mockDispatch.mockClear();
      unmount();
    });

    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith(removeCSDAction({ id: ctrl.id }));
  });

  it('should subscribe/unsubscribe CSD sagas', () => {
    mockDispatch.mockClear();
    // NOTE fuck typescript - because jest was mock the "react-redux" here
    mockedUseSelector.mockClear();
    const { unmount } = renderHook(() => useSubscribe(ctrl));

    expect(mockDispatch).toBeCalledTimes(2);
    // NOTE first from "useReducerSubscribe"
    expect(mockDispatch.mock.calls[1][0]).toEqual(subscribeAction(ctrl));

    expect(useSelector).toBeCalledTimes(1);
    // // NOTE compare bind functions
    expect(String(mockedUseSelector.mock.calls[0][0])).toEqual(String(createSelectorIsConnected(ctrl.id)));

    act(() => {
      mockDispatch.mockClear();
      mockedUseSelector.mockClear();
      unmount();
    });

    expect(mockDispatch).toBeCalledTimes(2);
    // NOTE first from "useReducerSubscribe"
    expect(mockDispatch.mock.calls[0][0]).toEqual(removeCSDAction({ id: ctrl.id }));
    expect(mockDispatch.mock.calls[1][0]).toEqual(unsubscribeAction(ctrl));
  });

});

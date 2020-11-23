
// outsource dependencies
import React from 'react';

// local dependencies
import * as CTRL from './index';
import { testCtrl, renderHookWithRedux, formattedActionNames } from './test.mock';

describe('Controller interface', () => {

  it('should exist', () => {
    expect(CTRL).toEqual(
      expect.objectContaining({
        sagas: expect.any(Function),
        reducer: expect.any(Function),
        useController: expect.any(Function),
        prepareController: expect.any(Function),
        useControllerData: expect.any(Function),
        useControllerActions: expect.any(Function),
        useControllerSubscribe: expect.any(Function),
      })
    );
  });

  it('saga middleware connector "sagas"', () => {
    expect(CTRL.sagas).toBeInstanceOf(Function);
  });

  it('redux store connector "reducer"', () => {
    expect(CTRL.reducer).toBeInstanceOf(Function);
  });

  it('helper to simplify generating annotation "prepareController"', () => {
    expect(CTRL.prepareController).toBeInstanceOf(Function);
  });

  it('part hook "useControllerActions"', () => {
    const { result } = renderHookWithRedux(() => CTRL.useControllerActions(testCtrl));

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

  it('part hook "useControllerData"', () => {
    const { result } = renderHookWithRedux(() => CTRL.useControllerData(testCtrl));

    expect(result.current).toEqual(
      expect.objectContaining(testCtrl.initial)
    );
  });

  it('part hook "useControllerSubscribe"', () => {
    const { result } = renderHookWithRedux(() => CTRL.useControllerSubscribe(testCtrl));

    expect(result.current).toEqual(
      expect.any(Boolean)
    );
  });

  it('Main hook "useController" usage', () => {
    const { result } = renderHookWithRedux(() => CTRL.useController(testCtrl));

    expect(result.current).toEqual(
      expect.arrayContaining([
        // NOTE "useControllerData" results
        expect.objectContaining(testCtrl.initial),
        // NOTE "useControllerActions" results
        expect.objectContaining({
          clearCtrl: expect.any(Function),
          updateCtrl: expect.any(Function),
          [formattedActionNames[0]]: expect.any(Function),
          [formattedActionNames[1]]: expect.any(Function),
          [formattedActionNames[2]]: expect.any(Function),
        }),
        // NOTE "useControllerSubscribe" results
        expect.any(Boolean)
      ])
    );
  });
});

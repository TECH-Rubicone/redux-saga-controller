
// outsource dependencies
import React from 'react';

// local dependencies
import * as CTRL from '../src';
const { sagas, reducer, Controller, useController, useControllerActions, useControllerData, useControllerSubscribe } = CTRL;

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

  it('should exist "Controller"', () => {
    expect(Controller).toBeInstanceOf(Function);
  });

  it('should exist "sagas"', () => {
    expect(sagas).toBeInstanceOf(Function);
  });

  it('should exist "reducer"', () => {
    expect(reducer).toBeInstanceOf(Function);
  });

  it('should exist "useController"', () => {
    expect(useController).toBeInstanceOf(Function);
  });

  it('should exist "useControllerActions"', () => {
    expect(useControllerActions).toBeInstanceOf(Function);
  });

  it('should exist "useControllerData"', () => {
    expect(useControllerData).toBeInstanceOf(Function);
  });

  it('should exist "useControllerSubscribe"', () => {
    expect(useControllerSubscribe).toBeInstanceOf(Function);
  });
});

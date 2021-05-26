
// outsource dependencies
import React, { memo, useEffect, useCallback } from 'react';

// local dependencies
import { controller } from './controller';
import { useController, useControllerActions, useControllerData, useControllerSubscribe } from '../src'; // Use line below
// import { useController, useControllerActions, useControllerData, useControllerSubscribe } from 'redux-saga-controller';

export const Example1 = memo(() => {
  // NOTE Prefer way
  const [
    { data, disabled, initialized },
    { INITIALIZE, clearCtrl, getSelf, updateCtrl },
    isControllerConnected
  ] = useController(controller);

  updateCtrl({ disabled: true });
  const handleToggleDisabled = useCallback(
    () => updateCtrl({ disabled: !disabled }),
    [updateCtrl, disabled]
  );
  const handleGetSef = useCallback(
    () => getSelf({ id: 2 }),
    [updateCtrl, disabled]
  );
  useEffect(() => {
    INITIALIZE({ foo: 2 });
    return () => { clearCtrl(); };
  }, [INITIALIZE, clearCtrl]);

  if (!initialized || !isControllerConnected) { return null; }
  return <div>
    <h1>Hello {data.name}! Your age is {data.age}</h1>
    <button onClick={handleToggleDisabled}> toggle disabled </button>
    <button disabled={disabled} onClick={handleGetSef}> Get Details </button>
  </div>;
});

export const Example2 = memo(() => {
  // NOTE Prefer way because it will be use initial value if actual value doesn't exist
  const { data, disabled, initialized } = useControllerData(controller);
  // NOTE Actions are already wrapped with dispatch
  const { INITIALIZE, getSelf, clearCtrl } = useControllerActions(controller);
  // NOTE isControllerConnected
  const isControllerConnected = useControllerSubscribe(controller);

  useEffect(() => {
    INITIALIZE({ foo: 2 });
    return () => { clearCtrl(); };
  }, [INITIALIZE, clearCtrl]);

  if (!initialized || !isControllerConnected) { return null; }
  return <div>
    <h1>Hello {data.name}! Your age is {data.age}</h1>
    <button disabled={disabled} onClick={() => getSelf()}>Get Details</button>
  </div>;
});

export const Example3 = memo(() => {
  // NOTE Prefer way
  const [
    store,
    actions,
    isControllerConnected
  ] = useController(controller);

  useEffect(() => {
    actions.INITIALIZE();
    return () => { actions.clearCtrl(); };
  }, [actions.INITIALIZE, actions.clearCtrl]);

  if (!store.initialized || !isControllerConnected) { return null; }
  return <div>
    <h1>Hello {store.data.name}! Your age is {store.data.age}</h1>
    <button disabled={store.disabled} onClick={() => actions.GET_SELF()}>Get Details</button>
  </div>;
});


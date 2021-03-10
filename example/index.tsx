
// outsource dependencies
import { useSelector } from 'react-redux';
import React, { memo, useEffect } from 'react';

// local dependencies
import { controller } from './controller';
import { useController, useControllerActions, useControllerData, useControllerSubscribe } from '../src'; // Use line below
// import { useController, useControllerActions, useControllerData, useControllerSubscribe } from 'redux-saga-controller';

export const Example1 = memo(() => {
  // NOTE Prefer way
  const [
    { data, disabled, initialized },
    { INITIALIZE, clearCtrl, GET_SELF },
    isControllerConnected
  ] = useController(controller);

  useEffect(() => {
    INITIALIZE();
    return clearCtrl;
  }, [INITIALIZE, clearCtrl]);

  if (!initialized || !isControllerConnected) { return null; }
  return <div>
    <h1>Hello {data.name}! Your age is {data.age}</h1>
    <button disabled={disabled} onClick={() => GET_SELF()}>Get Details</button>
  </div>;
});

export const Example2 = memo(() => {
  // NOTE Prefer way because it will be use initial value if actual value doesn't exist
  const { data, disabled, initialized } = useControllerData(controller);
  // NOTE Actions are already wrapped with dispatch
  const { INITIALIZE, CLEAR_CTRL, GET_SELF, clearCtrl } = useControllerActions(controller);
  // NOTE isControllerConnected
  const isControllerConnected = useControllerSubscribe(controller);

  useEffect(() => {
    INITIALIZE({ foo: 2 });
    return () => { clearCtrl({}); };
  }, [INITIALIZE, clearCtrl]);

  if (!initialized || !isControllerConnected) { return null; }
  return <div>
    <h1>Hello {data.name}! Your age is {data.age}</h1>
    <button disabled={disabled} onClick={() => GET_SELF()}>Get Details</button>
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
    return actions.CLEAR_CTRL;
  }, [actions.INITIALIZE, actions.CLEAR_CTRL]);

  if (!store.initialized || !isControllerConnected) { return null; }
  return <div>
    <h1>Hello {store.data.name}! Your age is {store.data.age}</h1>
    <button disabled={store.disabled} onClick={() => actions.GET_SELF()}>Get Details</button>
  </div>;
});

export const Example4 = memo(() => {
  // NOTE useSelector ability to get data from selector
  const data = useSelector(controller.selector);
  console.log(data.actual.data.name); // John
  console.log(data.initial.data.name); // John
  console.log(data.connected); // true | false

  const actualData = useSelector(controller.selectorActual);
  console.log(actualData.data.name); // John

  const initialData = useSelector(controller.selectorInitial);
  console.log(initialData.data.name); // John

  const isConnected = useSelector(controller.selectorConnected);
  console.log(isConnected); // true | false

  const allData = useSelector(controller.selector);
  console.log(allData.actual.data.name); // John
  console.log(allData.initial.data.name); // John
  console.log(allData.connected); // true | false

  return <h1>{isConnected ? actualData.data.name : initialData.data.name }</h1>;
});

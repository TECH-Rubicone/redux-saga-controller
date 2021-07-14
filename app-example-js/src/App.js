import './App.css';
import logo from './logo.svg';
import React, { useEffect, useCallback } from 'react';
import { controller } from './controller';
import { useController } from 'redux-saga-controller';

function App() {
  const [
    { data, disabled, initialized },
    { initialize, getSelf },
  ] = useController(controller);

  useEffect(() => { initialize({ some: 'probably route data for initialization'}) }, [initialize]);
  const handleGetData = useCallback(getSelf, [getSelf]);

  return (
    <div className="App">
      <header className="App-header">
        { !initialized ? <img src={logo} className="App-logo" alt="logo" /> : <>
          <h2> DATA </h2>
          <p> { JSON.stringify(data) } </p>
        </> }
      </header>
      <button disabled={disabled} onClick={handleGetData}> GET </button>
    </div>
  );
}

export default App;


// outsource dependencies
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import { useController } from 'redux-saga-controller';
import React, { useCallback, useEffect } from 'react';

// local dependencies
import './index.css';
import store from './store';
import logo from './logo.svg';
import { controller } from './controller';


function App() {
  const [
    { data, disabled, initialized },
    { initialize, getSelf },
  ] = useController(controller);

  useEffect(() => { initialize({ some: 'probably route data for initialization'}) }, [initialize]);
  const handleGetData = useCallback(() => getSelf({ id: 1 }), [getSelf]);

  return <div className="container">
    { !initialized ? <img src={logo} className="logo" alt="logo" /> : <>
      <h2> DATA </h2>
      <p> { JSON.stringify(data) } </p>
      <button className="btn" disabled={disabled} onClick={handleGetData}>
        { disabled ? <img src={logo} className="logo" alt="logo" /> : <span> GET </span> }
        {/*<img src={logo} className="logo" alt="logo" />*/}
      </button>
    </> }
  </div>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Provider store={store}>
          <App />
      </Provider>
  </React.StrictMode>
);

import { createStore, compose, applyMiddleware } from 'redux';
import * as identity from 'lodash.identity';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import { persistState } from 'redux-devtools';
import { INITIAL_STATE } from '../core/constants';
import { reducers } from '../reducers';
import { middleware } from '../middleware';

export function makeStore(initialState = INITIAL_STATE) {

  const activateDevTools = canUseDOM && window.devToolsExtension // :off
    ? window.devToolsExtension()
    : identity; // :on
  const enhancer = compose(// :off
    applyMiddleware(...middleware),
    activateDevTools,
    persistState(getDebugSessionKey())
  ); // :on

  const store = createStore(reducers, initialState, enhancer);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers').reducers;
      console.log('nextReducer', nextReducer);
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}

function getDebugSessionKey() {
  const matches = canUseDOM  // :off
    ? window.location.href.match(/[?&]debug_session=([^&]+)\b/)
    : []; // :on
  return (matches && matches.length) ? matches[ 1 ] : null;
}
import React from 'react';
import ReactDOM from 'react-dom';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import Location from './lib/Location';
import App from './components/App';
import makeStore from './app/stores';
const store = makeStore();
const routes = {}; // Auto-generated on build. See tools/lib/routes-loader.js

const route = async(path, callback) => {
  if (path !== '/' && path.endsWith('/')) {
    path = path.slice(0, -1); // eslint-disable-line no-param-reassign
  }
  const handler = routes[path] || routes['/404'];
  const componentHandler = await handler();
  const component = typeof componentHandler === 'function'
    ? componentHandler
    : componentHandler.default;

  await callback(<App store={store}>{React.createElement(component)}</App>);
};

function run() {
  const container = document.getElementById('app');
  Location.listen(location => {
    route(location.pathname, async(component) => ReactDOM.render(component, container, () => {
      // Track the page view event via Google Analytics
      // noinspection JSUnresolvedFunction
      window.ga('send', 'pageview');
    }));
  });
}

if (canUseDOM) {
  // Run the application when both DOM is ready
  // and page content is loaded
  if (window.addEventListener) {
    window.addEventListener('DOMContentLoaded', run);
  }
  else {
    window.attachEvent('onload', run);
  }
}

export default {
  route,
  routes,
};

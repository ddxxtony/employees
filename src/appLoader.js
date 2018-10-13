import 'normalize.css';

import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { BrowserRouter, Route } from 'react-router-dom';

import { App } from './components/app';
import { rootReducer } from './reducers';
import HotLoader from './appHotLoader';
import { getEmployees } from './actions';


const composeEnhancers = process.env.NODE_ENV === 'production' ? compose : (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose);
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
store.dispatch(getEmployees());

const render = (Component) => {
  ReactDOM.render(
    <HotLoader>
      <Provider store={store}>
        <BrowserRouter>
          <Route component={Component} />
        </BrowserRouter>
      </Provider>
    </HotLoader>,
    document.getElementById('root')
  );
};

render(App);

if (module.hot) {
  module.hot.accept('./components/app', () => render(App));
  module.hot.accept('./reducers', () => store.replaceReducer(rootReducer));
}
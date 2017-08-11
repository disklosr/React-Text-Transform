import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { createStore } from 'redux';
import { transform } from './reducers/index';
import { StoreState } from './types/index';
import { Provider } from 'react-redux';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import registerServiceWorker from './registerServiceWorker';
import './index.css';

import Transformer from './containers/Transformer';

const store = createStore<StoreState>(transform, {
  outputText: '',
  debugText: ''
});

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider>
      <Transformer />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();

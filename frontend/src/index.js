import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { SnackbarProvider } from 'notistack';
import axios from 'axios';

// Set axios base URL
axios.defaults.baseURL = 'http://localhost:4000';



ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <SnackbarProvider
        maxSnack={2}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Router>
          <App />
        </Router>
      </SnackbarProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
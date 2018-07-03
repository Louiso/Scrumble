import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import registerServiceWorker from './registerServiceWorker';

/* AGREGANDO CSS */
import 'bootstrap/dist/css/bootstrap.min.css';
import 'material-design-lite/material.min.css';
import 'material-design-lite/material.min.js';
import './index.css';

/* AGREGANDO VARIABLES DE APLICACION */
import { Provider } from 'mobx-react';
import { store } from './store/store';

/* CONECTANDO A LA BASE DE DATOS */
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';

import { config } from './config/config';

firebase.initializeApp(config);

ReactDOM.render(
    
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root'));
registerServiceWorker();

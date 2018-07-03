import React, { Component } from 'react';
import './App.css';

/* RUTAS */
import { BrowserRouter as Router } from "react-router-dom";

/* COMPONENTES */
import Header from './components/Header/Header';
import SideBar from './components/SideBar/SideBar';
import Routes from './routes/Routes';
import Footer from './components/Footer/Footer';

/* AGREGANDO VARIABLE GLOBAL */
import { inject , observer } from 'mobx-react';

import firebase from 'firebase/app';

@inject('store') @observer
class App extends Component {
  componentDidMount() {
    // Cuando se conecta
    firebase.auth().onAuthStateChanged((user)=> {
      this.props.store.user = user;
    });
    
  }
  render() {
    return (
      <Router>
        <div className="App">
          <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header mdl-layout--fixed-tabs">

            <Header/>  
            <SideBar/>

            <main className="mdl-layout__content">
              <Routes/>
              <Footer/>
            </main>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;

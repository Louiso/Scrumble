import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom';
import Inicio from '../components/pages/Inicio/Inicio';
import Notificaciones from '../components/pages/Notificaciones/Notificaciones';
import Reservas from '../components/pages/Reservas/Reservas';
import Login from '../components/pages/Login/Login';
import Configuraciones from '../components/pages/Configuraciones/Configuraciones';
import Perfil from '../components/pages/Perfil/Perfil';
import Registrar from '../components/pages/Registrar/Registrar';
import PostReserva from '../components/pages/PostReserva/PostReserva';

import NoMatch from '../components/pages/NoMatch/NoMatch';

export default class Routes extends Component {
  render() {
    return (
      <Switch>
        {/* El contenido esta dentro de inicio */}
        <Redirect from='/' exact to="/inicio"/>

        {/* zeldas por header */}
        <Route path='/inicio' component={Inicio}/>
        <Route path='/notificaciones' component={Notificaciones}/>
        
        <Route path='/reservas' component={Reservas}/>
        
        {/* zeldas por sidebar */}
        <Route path='/perfil/:id' component={Perfil}/>
        <Route path='/perfil' component={Perfil}/>
        <Route path='/configuraciones' component={Configuraciones}/>
        <Route path='/login' component={Login}/>
        <Route path='/registrar' component={Registrar}/>
        <Route path='/posts/:id' component={PostReserva}/>
        
        <Route component={NoMatch}/>
      </Switch>
    )
  }
}

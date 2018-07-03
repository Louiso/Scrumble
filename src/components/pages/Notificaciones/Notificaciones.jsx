import React, { Component } from 'react'

import './Notificaciones.css';

import { inject , observer } from 'mobx-react';
import Notificacion from './Notificacion/Notificacion';
import UserController from '../../../controllers/User';

@inject('store') @observer
export default class NotificacionesLoading extends Component {
  render(){
    const { user } = this.props.store;
    if(user && user.uid){
      return(
        <Notificaciones user = {user}/>
      );
    }
    return(
      <div>
        AQUI DEBERIA DE MANDARME A INICIAR SESION
      </div>
    );
  }
}
class Notificaciones extends Component {
  constructor(props){
    super(props);
    this.state = {
      notificaciones:[]
    }
  }

  componentDidMount(){
    
    this.user = new UserController(this.props.user.uid);

    this.user.getNotificationsRealTime(
      (notificacion)=>{
        
        const { notificaciones } = this.state;
        notificaciones.push(notificacion);
        this.setState({
          notificaciones
        });
    
      }
    );
  }
  componentWillUnmount(){
    this.user.destroy();
  }
  renderNotificaciones(){
    return this.state.notificaciones.map((notificacion,index)=>{
      return(
        <Notificacion key = {index} notificacion = {notificacion}/>
      );
    }).reverse();
  }
  render() {
    return (
      <div className="list-group Notificaciones">
        {this.renderNotificaciones()}
      </div>
    )
  }
}

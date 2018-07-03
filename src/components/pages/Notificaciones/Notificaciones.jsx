import React, { Component } from 'react'

import firebase from 'firebase/app';

import './Notificaciones.css';

import { inject , observer } from 'mobx-react';
import Notificacion from './Notificacion/Notificacion';

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
  child_added = (snapChild)=>{
      
    let notificacion = snapChild.val();
    notificacion.key = snapChild.key;
    const {notificaciones} = this.state;
    notificaciones.push(notificacion);
    this.setState({
      notificaciones
    });

  }

  child_changed = () => {

  }
  
  componentDidMount(){
    this.notificacionesRef = firebase.database().ref(`/profiles/${this.props.user.uid}/notificaciones`);
    // Esto es lo primer que trae desde lo ultimo
    /* FALTA AGREGAR PAGINACION */
    // orderByChild('date').limitToLast(5).
    this.notificacionesRef.on('child_added',this.child_added);
    this.notificacionesRef.on('child_changed',this.child_changed);
  }
  componentWillUnmount(){
    this.notificacionesRef.off('child_added',this.child_added);
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

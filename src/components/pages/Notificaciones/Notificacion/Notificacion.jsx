import React, { Component } from 'react'

import { Link } from 'react-router-dom';

import { inject , observer } from 'mobx-react';

import moment from 'moment';

import UserController from '../../../../controllers/User';
import ReservaController from '../../../../controllers/Reservas';

@inject('store') @observer
export default class NotificacionLoading extends Component {
  render(){
    const { notificacion , store: { user }} = this.props;
    if(user && user.uid){
      return(
        <Notificacion notificacion = {notificacion} user = { user }/>
      );
    }
    return ''
  }
}

class Notificacion extends Component {
  constructor(props){
    super(props);
    this.state = {
      emisorProfile : null,
      verDetalles: false
    }
  }
  componentDidMount = async () => {
    this.user = new UserController(this.props.notificacion.emisor);
    const emisorProfile = await this.user.getUserProfile(); 
    this.setState({
      emisorProfile
    });
  }

  componentWillUnmount(){
    this.user.destroy();
  }

  verNotificacion = () => {
    
    this.user = new UserController(this.props.user.uid);
    let notificacion = this.props.notificacion;
    notificacion = {
      ...notificacion,
      visto: true
    }
    delete notificacion.key;
    this.user.setNotificacion(this.props.notificacion.key,notificacion);
  
  }

  verDetallesNotificacion = ()=>{
    this.verNotificacion();
    this.setState({
      verDetalles: true
    });
  }
  cerrarDetallesNotificacion = () => {
    this.setState({
      verDetalles: false
    });
  }
  handleConfirmar = async () => {
    this.verNotificacion();
    this.reserva = new ReservaController(this.props.notificacion.origen);
    let reserva = await this.reserva.getReserva();
    reserva = {
      ...reserva,
      confirmacion: true
    };

    const { key } = reserva; 
    delete reserva.key;
    
    this.reserva.setReserva(reserva);
    
    this.user = new UserController(reserva.emisor);
    this.user.setReserva(key,reserva);
    
    this.user.setId(reserva.receptor);
    this.user.setReserva(key,reserva);

  }
  render() {
    const { notificacion } = this.props;
    const { emisorProfile } = this.state;
    let color = null;
    if(!notificacion.visto){
      color = 'list-group-item-primary';
    }
    return (
      <div className={`list-group-item list-group-item-action flex-column align-items-start ${color}`}>
        <div className="d-flex w-100 justify-content-between">
          <h5 className="mb-1">
          {emisorProfile?(<Link onClick = {this.verNotificacion } to={`/perfil/${emisorProfile.key}`}>{emisorProfile.username}</Link>):''}
          {` ha realizado una ${notificacion.tipo}`}
          </h5>
          <small>{moment(notificacion.date).fromNow()}</small>
        </div>
        <div className="d-flex w-100 justify-content-between align-items-center">
          <small onClick={this.verDetallesNotificacion} >Ver detalles</small>
          <p className="mb-1">
            <button onClick = {this.handleConfirmar } type="button" className="btn btn-success">
              Confirmar Reserva
            </button>
          </p>
        </div>
        { this.state.verDetalles?(
          <div>
            <h6>Detalles</h6>
            <button onClick = {this.cerrarDetallesNotificacion}>Cerrar</button>
          </div>
        ):''}
      </div>
    )
  }
}

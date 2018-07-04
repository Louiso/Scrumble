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
    this.reserva = new ReservaController();
    this.user = new UserController(this.props.notificacion.emisor);
    const emisorProfile = await this.user.getUserProfile(); 
    this.setState({
      emisorProfile
    });
  }

  componentWillUnmount(){
    this.user.destroy();
    this.reserva.destroy();
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
    this.reserva.setId(this.props.notificacion.origen);
    let reserva = await this.reserva.getReserva();
    reserva = {
      ...reserva,
      confirmacion: true
    };

    const { key } = reserva; 
    delete reserva.key;
    
    /* Se actualiza la reserva */
    this.reserva.setReserva(reserva);
  
    /* Se guarda la reserva en emisor */
    this.user.setId(reserva.emisor);
    await this.user.setReserva(key,{
      nAsientos: reserva.nAsientos,
      fechaReserva: reserva.fechaReserva,
      fechaCreacion: reserva.fechaCreacion
    });

    const { emisor, receptor } = reserva;
    
    const notificacion = {
      emisor: receptor,
      receptor: emisor,
      origen: key,
      tipo: 'confirmar',
      fechaCreacion: moment()._d.toISOString(),
      visto: false,
    }
    /* El que mando la solicitud recibe mensaje de confirmacion */
    await this.user.addNotificacion(notificacion);    
    
    /* Se guarda la reserva en receptor */
    this.user.setId(reserva.receptor);
    this.user.setReserva(key,{
      nAsientos: reserva.nAsientos,
      fechaReserva: reserva.fechaReserva,
      fechaCreacion: reserva.fechaCreacion
    });

  }

  handleCancelar = async () => {
    let keyReserva = this.props.notificacion.origen;
    console.log(keyReserva);
    this.reserva.setId(keyReserva);
    
    // /* CON ESTO SE CAMBIA EL ESTADO DE LA RESERVA A CANCELADO */
    let reserva = await this.reserva.getReserva();
    
    reserva = {
      ...reserva,
      cancelado: true
    }
    delete reserva.key;
    
    await this.reserva.setReserva(reserva);
    /* Enviar notificacion de cancelar */
    /* SOY EL RECEPTOR */
    const notificacion = {

      emisor        : reserva.receptor,       // Quien crea la notificacion
      tipo          : 'cancelar',                        // El tipo de notificacion que es
      origen        : keyReserva,                       // El origen de la notificacion
      visto         : false,
      fechaCreacion : moment()._d.toISOString()

    }

    this.user.setId(reserva.emisor);
    await this.user.addNotificacion(notificacion);
    
  }

  

  getColor(){
    const { notificacion } = this.props;
    let color = null;
    if(!notificacion.visto){
      color = 'list-group-item-primary';
    }
    return color;
  }

  getMensaje(){
    let mensaje;
    const { notificacion } = this.props;
    const { emisorProfile } = this.state;
    const nombreEmisor = emisorProfile?(<Link onClick = {this.verNotificacion } to={`/perfil/${emisorProfile.key}`}>{emisorProfile.username}</Link>):'';     
    switch(notificacion.tipo){
      case 'reserva':
        mensaje = (
          <h5 className = "mb-1">
            {nombreEmisor}{` ha realizado una reservacion`}
          </h5>
        );  
        break;
      case 'confirmar':
        mensaje = (
          <h5 className = "mb-1">
            {nombreEmisor}{` confirmo su reservacion`}
          </h5>
        );
        break;
      case 'cancelar':
        mensaje = (
          <h5 className = "mb-1">
            {nombreEmisor}{` no cancelo la reservacion`}
          </h5>          
        );
        break;
      case 'culminado':
        mensaje = (
          <h5 className = "mb-1">
            {nombreEmisor}{` le agradece por su asistencia`}
          </h5>          
        );
        break;
      default:
        break;
    }
    return mensaje;
  }
  
  getButtons(){
    const { notificacion } = this.props;
    /* SOLO SI ES DE RESERVA SE PUEDE CANCELAR ALLI MISMO O CONFIRMAR */
    if(notificacion.tipo === 'reserva'){
      return (
        <p className="mb-1">
          <button onClick = {this.handleCancelar } type="button" className="btn btn-danger">
            Cancelar Reserva
          </button>
          <button onClick = {this.handleConfirmar } type="button" className="btn btn-success">
            Confirmar Reserva
          </button>
        </p>
      );
    }
    return '';
    
  }

  render() {
    const { notificacion } = this.props;
    return (
      <div className={`list-group-item list-group-item-action flex-column align-items-start ${this.getColor()}`}>
        <div className="d-flex w-100 justify-content-between">
          {this.getMensaje()}
          <small>{moment(notificacion.fechaCreacion).fromNow()}</small>
        </div>
        <div className="d-flex w-100 justify-content-between align-items-center">
          <small onClick={this.verDetallesNotificacion} >Ver detalles</small>
          { this.getButtons() }
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

import React, { Component } from 'react'

import { inject , observer } from 'mobx-react';

// import moment from 'moment';

import './BotonCancelar.css';
import ReservaController from '../../../../controllers/Reservas';

@inject('store') @observer
export default class BotonCancelarLoading extends Component {
  render(){
    const { store : { user } } = this.props;
    if(user && user.uid){
      
      const { emisorProfile , reserva } = this.props;

      return(
        <BotonCancelar user = { user } emisorProfile = { emisorProfile } reserva = { reserva }/>
      );
    }
    return(
      <button type="button" className="btn btn-danger BotonCancelar">
        ...Loading
      </button>
    );
  }
}

/* NUNCA SE ELIMINA UNA RESERVACION */

class BotonCancelar extends Component {

  handleCancelar = async () => {
    
    let { reserva } = this.props;
    // const { key } = reserva;
    this.reserva = new ReservaController(reserva.key);

    /* CON ESTO SE CAMBIA EL ESTADO DE LA RESERVA A CANCELADO */

    reserva = {
      ...reserva,
      cancelado: true
    }
    delete reserva.key;
    this.reserva.setReserva(reserva);
    // CAMBIAR CORRECTAMENTE LOS NOMBRES EMISOR Y RECEPTOR DE RESERVA A CREADORPOST , SOLICITANTE
    /* ENVIA NOTIFICACION */
    /* EL QUE PUEDE CANCELAR  */
/*     const notificacion = {

      emisor        : reserva.receptor,       // Quien crea la notificacion
      tipo          : 'cancelar',                        // El tipo de notificacion que es
      origen        : key,                       // El origen de la notificacion
      visto         : false,
      fechaCreacion : moment()._d.toISOString()

    }

    this.user.setId(reserva.emisor);
    await this.user.addNotificacion(notificacion);
     */
  }
  handleConcluir = async () => {
    let { reserva } = this.props;
    
    this.reserva = new ReservaController(reserva.key);

    /* CON ESTO SE CAMBIA EL ESTADO DE LA RESERVA A COMPLETADO */

    reserva = {
      ...reserva,
      completado: true
    }
    delete reserva.key;
    this.reserva.setReserva(reserva);
  }
  getColor(){

  }
  render() {

    const { emisorProfile, user } = this.props;  
    // El receptor que confirma no puede cancelar reserva
    if(emisorProfile.key === user.uid){
      return (
        <button onClick = {this.handleCancelar } type="button" className="btn btn-danger BotonCancelar">
          Cancelar Reserva
        </button>
      )
    }else{
      return (
        <button onClick = {this.handleConcluir } type="button" className="btn btn-primary BotonConcluir">
          Concluir Reserva
        </button>
      ) 
    }
  }
}

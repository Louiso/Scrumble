import React, { Component } from 'react'

import DatePicker from 'react-datepicker';
import GroupInput from '../../../GroupInput/GroupInput';

import moment from 'moment';
import ReservaController from '../../../../controllers/Reservas';
import UserController from '../../../../controllers/User';

export default class FormReservar extends Component {
  constructor(props){
    super(props);
    this.state = {
      nAsientos: 1,
      fechaReserva: moment()
    }
  }
  handleSubmit = async (e) => {
    e.preventDefault();
    try{
      
      const reserva = {
        
        emisor        : this.props.userProfile.key,       // Quien lo solicita
        receptor      : this.props.creadorPost.key,       // Quien lo recibe
        post          : this.props.post.key,              // De que post surgio la reserva
        nAsientos     : this.state.nAsientos,        // La cantidad de asientos
        fechaReserva          : this.state.fechaReserva._d.toISOString(), // La fecha de reserva
        confirmacion  : false,                            // para confirma la reserva
        fechaCreacion : moment()._d.toISOString(),
        completado    : false,
        cancelado     : false

      };
      const _reserva = new ReservaController();

      /* CREANDO RESERVA */
      const keyReserva = await _reserva.addReserva(reserva);      

      const notificacion = {

        emisor        : this.props.userProfile.key,       // Quien crea la notificacion
        tipo          : 'reserva',                        // El tipo de notificacion que es
        origen        : keyReserva,                       // El origen de la notificacion
        fechaReserva          : this.state.fechaReserva._d.toISOString(),  // La hora en que se creo la notificacion
        visto         : false,
        fechaCreacion : reserva.fechaCreacion

      }

      /* AGREGANDO NOTIFICACION Y RESERVA EN EL CREADOR DEL POST */
      const _user = new UserController(this.props.creadorPost.key);
      await _user.addNotificacion(notificacion);
      
      /* LAS RESERVAS SE AGREGAN A LOS USUARIOS CUANDO SON CONFIRMADAS */
    
    }catch(e){
      
      console.log(e.message);
    
    }
    
  }
  handleChangeDate = (fechaReserva) => {
    this.setState({
      fechaReserva:fechaReserva
    });
  }
  handleChange = (e) => {
    const { name , value } = e.target;
    this.setState({
      [name]: value
    });
  }
  render() {
    return (
      <form onSubmit = { this.handleSubmit }>
        <DatePicker
          selected={this.state.fechaReserva}
          onChange={this.handleChangeDate}
          showTimeSelect
          minTime={moment().hours(17).minutes(0)}
          maxTime={moment().hours(20).minutes(30)}
          dateFormat="LLL"
        />
        <GroupInput text="nAsientos" value = {this.state.nAsientos} handleChange = { this.handleChange }/>
        <input type="submit" value="Enviar solicitud de reserva"/>
      </form>
    );
  }
}

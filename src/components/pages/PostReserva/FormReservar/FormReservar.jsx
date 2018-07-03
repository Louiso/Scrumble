import React, { Component } from 'react'

import DatePicker from 'react-datepicker';
import GroupInput from '../../../GroupInput/GroupInput';

import moment from 'moment';
import { addUserProfileNotificacion } from '../../../../helpers/User';
import { crearReserva } from '../../../../helpers/Reserva';

export default class FormReservar extends Component {
  constructor(props){
    super(props);
    this.state = {
      numeroasientos: 1,
      date: moment()
    }
  }
  handleSubmit = async (e) => {
    e.preventDefault();
    try{
      
      const reserva = {
        
        emisor        : this.props.userProfile.key,       // Quien lo solicita
        receptor      : this.props.creadorPost.key,     // Quien lo recibe
        post          : this.props.post.key,              // De que post surgio la reserva
        numeroasientos: this.state.numeroasientos,        // La cantidad de asientos
        date          : this.state.date._d.toISOString(), // La fecha de reserva
        confirmacion  : false                             // para confirma la reserva

      };
      console.log(reserva);
      const keyReserva = await crearReserva(reserva);

      const notificacion = {

        emisor      : this.props.userProfile.key,       // Quien crea la notificacion
        tipo        : 'reserva',                        // El tipo de notificacion que es
        origen      : keyReserva,                       // El origen de la notificacion
        date        : this.state.date._d.toISOString(),  // La hora en que se creo la notificacion
        visto       : false
        
      }

      console.log(notificacion);
      // La notificacion se guarda dentro del anfitrion
      await addUserProfileNotificacion(this.props.creadorPost.key, notificacion);
      
    }catch(e){
      
      console.log(e.message);
    
    }
    
  }
  handleChangeDate = (date) => {
    this.setState({
      date:date
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
          selected={this.state.date}
          onChange={this.handleChangeDate}
          showTimeSelect
          minTime={moment().hours(17).minutes(0)}
          maxTime={moment().hours(20).minutes(30)}
          dateFormat="LLL"
        />
        <GroupInput text="NumeroAsientos" value = {this.state.numeroasientos} handleChange = { this.handleChange }/>
        <input type="submit" value="Enviar solicitud de reserva"/>
      </form>
    );
  }
}

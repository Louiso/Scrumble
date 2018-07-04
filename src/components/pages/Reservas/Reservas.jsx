import React, { Component } from 'react'

import './Reservas.css';

import { inject , observer } from 'mobx-react';
import ReservaController from '../../../controllers/Reservas';
import Reserva from './Reserva/Reserva';
import UserController from '../../../controllers/User';

@inject('store') @observer
export default class ReservasLoading extends Component {
  render() {
    const { store : { user } } = this.props;
    if(user && user.uid){
      return (
        <Reservas user = { user }/>
      )
    }
    return (
      <div>
        Cargando Reservas
      </div>
    );
  }
}

class Reservas extends Component {
  constructor(props){
    super(props);
    this.state = {
      reservas: []
    }
  }

  componentDidMount(){
    this.user = new UserController(this.props.user.uid);
    this.reservas = new ReservaController();
    /* OBTENIENDO RESERVAS SOLO DEL USUARIO */
    this.user.getReservacionesRealTime( async (reserva)=>{

      let { reservas } = this.state;
      /* OBTENIENDO LA RESERVA COMPLETA  */
      this.reservas.setId(reserva.key);  
      reserva = await this.reservas.getReserva();
      
      reservas.push(reserva);
      
      this.setState({
        reservas
      });

    });

    this.reservas.getReservasRealTime(
      null,
      (reservaUpdated)=>{
      let { reservas } = this.state;
      reservas = reservas.map((reserva)=>{
        if(reserva.key === reservaUpdated.key){
          return reservaUpdated;
        }else{
          return reserva;
        }
      });
      console.log(reservas);
      this.setState({
        reservas
      });
    },
    (reservaRemoved)=>{
      let { reservas } = this.state;
      reservas = reservas.filter((reserva)=>{
        return reserva.key !== reservaRemoved.key
      });
      this.setState({
        reservas
      });
    });
    
  }

  componentWillUnmount(){
    this.user.destroy();
    this.reservas.destroy();
  }

  renderReservas(){
    return this.state.reservas.map((reserva)=>{
      return(
        <Reserva  key={ reserva.key } reserva = { reserva }/>
      );
    }).reverse();
  }

  render() {
    return (
      <div className="Reservas">
        { this.renderReservas() }
      </div>
    )
  }
}

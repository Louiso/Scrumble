import React, { Component } from 'react'

import './Reservas.css';

import { inject , observer } from 'mobx-react';
import ReservaController from '../../../controllers/Reservas';
import Reserva from './Reserva/Reserva';

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
    this.reservas = new ReservaController();
    this.reservas.getReservasRealTime(
      (reserva)=>{
        const { reservas } = this.state;
        reservas.push(reserva);
        this.setState({
          reservas
        }); 
      }
    );
  }

  componentWillUnmount(){
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

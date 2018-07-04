import React, { Component } from 'react'
import UserController from '../../../../controllers/User';

import { Link } from 'react-router-dom';
import moment from 'moment';
import BotonCancelar from '../BotonCancelar/BotonCancelar';

import './Reserva.css';

export default class Reserva extends Component {
  constructor(props){
    super(props);
    this.state = {
      emisorProfile: null,
      receptorProfile: null
    }
  }
  componentDidMount = async () => {
    const { reserva } = this.props;
    
    this.user = new UserController(reserva.emisor);
    const emisorProfile = await this.user.getUserProfile();
    
    this.user.setId(reserva.receptor);
    const receptorProfile = await this.user.getUserProfile();

    this.setState({
      emisorProfile,
      receptorProfile
    });
  }
  
  componentWillUnmount(){
    this.user.destroy();
  }

  getBoton(){
    const { reserva } = this.props;
    const { emisorProfile } = this.state;
    const boton = emisorProfile?<BotonCancelar emisorProfile = { emisorProfile } reserva = { reserva }/>:'';
    return boton;
  }
  getMensaje(){
    const { reserva } = this.props;
    const { emisorProfile , receptorProfile } = this.state;
    const nombreEmisor = emisorProfile?(<Link to={`/perfil/${emisorProfile.key}`}>{emisorProfile.username}</Link>):'';
    const nombreReceptor = receptorProfile?(<Link to={`/perfil/${receptorProfile.key}`}>{receptorProfile.username}</Link>):'';
    return (
      <h5 className="mb-1 Mensaje">
            {nombreReceptor}{` acepto la reserva de ${reserva.nAsientos} asientos para el dia ${moment(reserva.fechaReserva).format('LLL')} a `}{nombreEmisor}
      </h5>
    );
  }
  getColor(){
    const { reserva } = this.props;
    const color = "list-group-item-"; 
    if(reserva.cancelado){
      return color + "danger";
    }
    if(reserva.completado){
      return color + "success"
    }
    return color + "info";
  }
  render() {
    const { reserva } = this.props;
    const color = this.getColor();
    return (
      <div className={`list-group-item list-group-item-action flex-column align-items-start ${color}`}>
        <div className="d-flex w-100 justify-content-between">
          { this.getMensaje() }
          <small>{moment(reserva.fechaCreacion).fromNow()}</small>
        </div>
        <div className="d-flex w-100 justify-content-between align-items-center">
          <small onClick={this.verDetallesNotificacion} >Ver detalles</small>
          <p className="mb-1">
            {this.getBoton()}
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

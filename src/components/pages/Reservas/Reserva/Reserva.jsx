import React, { Component } from 'react'
import UserController from '../../../../controllers/User';

import { Link } from 'react-router-dom';
import moment from 'moment';

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
  render() {
    const { reserva } = this.props;
    const { emisorProfile , receptorProfile } = this.state;
    const color = "list-group-item-success";
    const nombreEmisor = emisorProfile?(<Link to={`/perfil/${emisorProfile.key}`}>{emisorProfile.username}</Link>):'';
    const nombreReceptor = receptorProfile?(<Link to={`/perfil/${receptorProfile.key}`}>{receptorProfile.username}</Link>):'';
    return (
      <div className={`list-group-item list-group-item-action flex-column align-items-start ${color}`}>
        <div className="d-flex w-100 justify-content-between">
          <h5 className="mb-1">
            {nombreReceptor}{` acepto la reserva de ${reserva.numeroasientos} asientos para el dia ${moment(reserva.date).format('LLL')} a `}{nombreEmisor}
          </h5>
          <small>{moment(reserva.date).fromNow()}</small>
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

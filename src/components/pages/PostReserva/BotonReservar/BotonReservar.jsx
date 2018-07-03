import React, { Component } from 'react'

import { inject , observer } from 'mobx-react';

import { Link } from 'react-router-dom';

import UserController from '../../../../controllers/User';

@inject('store') @observer
export default class BotonReservarLoading extends Component {
  render() {
    const user = this.props.store.user;
    if(user && user.uid){

      return (
        <BotonReservar user = { user } onClick = {this.props.onClick} setUserProfile = {this.props.setUserProfile}/>
      )
    }
    return(
      <Link to="/login"><button className="btn btn-lg btn-success">Iniciar Session</button></Link>
    );
  }
}


class BotonReservar extends Component {
  constructor(props){
    super(props);
    this.state = {
      userProfile : null
    }
  }
  value = (snap) => {
    const userProfile = snap.val();
    userProfile.key = snap.key;
    
  }
  componentDidMount = async () => {
    
    this.user = new UserController(this.props.user.uid);
    const userProfile = await this.user.getUserProfile();
    this.props.setUserProfile(userProfile);
    this.setState({
      userProfile
    });
  
  }

  componentWillUnmount(){

    this.user.destroy();
  
  }
  render() {
    return (
      <p><button className="btn btn-lg btn-success" onClick={this.props.onClick}>Reservar</button></p>
    )
  }
}

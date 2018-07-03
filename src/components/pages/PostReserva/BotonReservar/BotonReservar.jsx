import React, { Component } from 'react'

import { inject , observer } from 'mobx-react';

import firebase from 'firebase/app';

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
      <p><button className="btn btn-lg btn-success">Iniciar Session</button></p>
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
    this.props.setUserProfile(userProfile);
    this.setState({
      userProfile
    });
  }
  componentDidMount(){
    this.userProfileRef = firebase.database().ref(`/profiles/${this.props.user.uid}`);
    this.userProfileRef.on('value',this.value);

  }
  componentWillUnmount(){
    this.userProfileRef.off('value',this.value);
  }
  render() {
    return (
      <p><button className="btn btn-lg btn-success" onClick={this.props.onClick}>Reservar</button></p>
    )
  }
}

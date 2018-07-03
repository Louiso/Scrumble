import React, { Component } from 'react'

import { Link } from 'react-router-dom';

import { inject , observer } from 'mobx-react';

import firebase from 'firebase/app';

@inject('store') @observer
export default class SideBar extends Component {
	handleLogOut = () => {
		firebase.auth().signOut();
	}
  _render(user) {
    return (
      <div className="mdl-layout__drawer">
				<span className="mdl-layout-title">Fooders</span>
				<nav className="mdl-navigation">
					<Link className="mdl-navigation__link" to="/perfil">Perfil</Link>
					<Link className="mdl-navigation__link" to="/configuraciones">Configuraciones</Link>
					<div className="mdl-navigation__link" onClick = {this.handleLogOut }>Log Out</div>
				</nav>
			</div>
    )
	}
	_loading(){
		return (
			<div className="mdl-layout__drawer">
				<span className="mdl-layout-title">Fooders</span>
				<nav className="mdl-navigation">
					<Link className="mdl-navigation__link" to="/perfil">Perfil</Link>
					<Link className="mdl-navigation__link" to="/configuraciones">Configuraciones</Link>
					<Link className="mdl-navigation__link" to="/login">Iniciar Sesion</Link>
				</nav>
			</div>
		);
	}
	render(){
		if(this.props.store.user && this.props.store.user.uid){
			return this._render(this.props.store.user);
		}else{
			return this._loading();
		}
	}
	
}

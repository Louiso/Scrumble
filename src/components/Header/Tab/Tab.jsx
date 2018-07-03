import React, { Component } from 'react'
import Radium from 'radium';

import { inject , observer } from 'mobx-react';

import firebase from 'firebase/app';

let { Link } = require('react-router-dom');


Link = Radium(Link);

@inject('store') @observer
export default class TabLoading extends Component {
	render(){
		const { user } = this.props.store;
		if(user && user.uid){
			const {tab, tabSelected, onClick } = this.props;
			if(tab.text === 'Notificaciones'){
				return(
					<Tab user = {user} tab = {tab} tabSelected = { tabSelected } onClick = { onClick }/>
				);
			}
			
		}
		const {tab, tabSelected} = this.props;
		const tabStyle = [style["mdl-layout__tab"]];
		
		if(tab.text === tabSelected ){
			tabStyle.push(style.active);
		}
		let content = tab.text;
		if(tab.text === 'Notificaciones'){
			content = <span className="mdl-badge" data-badge={0}>{tab.text}</span>;
		}
		
		return (
			<Link  
				to={`/${tab.text.toLowerCase()}`} 
				onClick = {() => this.props.onClick(tab)} 
				className="mdl-layout__tab" 
				style = {tabStyle}>{content}
			</Link>
		);
	}
}

class Tab extends Component {
	constructor(props){
		super(props);
		this.state = {
			notificaciones : []
		};
	}
	child_added = (snap) => {
		/* SE GUARDA TODAS LAS NOTIFICACIONES */
		const notificacion = snap.val();
		notificacion.key = snap.key;
		const notificaciones = this.state.notificaciones;
		notificaciones.push(notificacion);
		this.setState({
			notificaciones
		});
	}
	child_changed = (snapChild)=>{
		const notificacionChanged = snapChild.val();
		notificacionChanged.key = snapChild.key;
		let  notificaciones = this.state.notificaciones;
		notificaciones = notificaciones.map((notificacion)=>{
			if(notificacion.key === notificacionChanged.key){
				return notificacionChanged;
			}else{
				return notificacion;
			}
		});
		this.setState({
			notificaciones
		});
	}
	componentDidMount(){
		/* EL USUARIO RECIBE LAS NOTIFICACIONES */
		this.notificacionesRef = firebase.database().ref(`/profiles/${this.props.user.uid}/notificaciones`);
		this.notificacionesRef.on('child_added',this.child_added);
		this.notificacionesRef.on('child_changed', this.child_changed);
	}
	componentWillUnmount(){
		this.notificacionesRef.off('child_added',this.child_added);
		this.notificacionesRef.off('child_changed',this.child_changed);
	}
	render() {
		const {tab, tabSelected} = this.props;
		const tabStyle = [style["mdl-layout__tab"]];
		
		if(tab.text === tabSelected ){
			tabStyle.push(style.active);
		}
		let content = tab.text;
		/* SE CALCULA LAS NOTIFICACIONES NO VISTAS */
		const notificacionesSinLeer = this.state.notificaciones.filter((notificacion)=>{
			return !notificacion.visto;
		});
		if(tab.text === 'Notificaciones'){
			content = <span className="mdl-badge" data-badge={notificacionesSinLeer.length}>{tab.text}</span>;
		}
		
		return (
			<Link  
				to={`/${tab.text.toLowerCase()}`} 
				onClick = {() => this.props.onClick(tab)} 
				className="mdl-layout__tab" 
				style = {tabStyle}>{content}
			</Link>
		);
  }
}

///////////////////////////////////////////////////////////
const style = {
	'mdl-layout__header':{
		backgroundColor: 'var(--color-primario)',
	},
	'mdl-layout__tab':{
		transition: 'all .5s ease',
		backgroundColor: 'var(--color-primario)',
		textDecoration: 'none',
		':hover':{
			color: 'white',	
		}
	},
	'active':{
		boxShadow: '0px -5px 0px 0px rgba(0,0,0,50%) inset',
	}
}
import React, { Component } from 'react'

import './Registrar.css';

import { Redirect } from 'react-router-dom';

import firebase from 'firebase/app';

export default class Registrar extends Component {
  constructor(props){
		super(props);
		this.state = {
			email: '',
			password: '',
			confirmPassword: '',
			logged: false,
			message: '',
			colorMessage: ''
		};
	}
	handleChange = (e) => {
		const { name , value } = e.target;
		this.setState({
			[name]: value
		});
	}
	handleSubmit = (e) => {
		e.preventDefault();
		const { email, password, confirmPassword } = this.state;
		if(password === confirmPassword ){
			firebase.auth().createUserWithEmailAndPassword(email,password)
				.then(response=>{
					this.setState({
						logged: true,
						message: 'Exito',
						colorMessage: 'alert-success'
					});
				})
				.catch(err=>{
					this.setState({
						message: 'Su correo ya esta siendo usado',
						colorMessage: 'alert-danger'
					});
				});
		}else{
			this.setState({
				message: 'No coinciden las contraseñas',
				colorMessage: 'alert-warning'
			});
		}
	}
  _render() {

		const alert = this.state.message ?<div className={`alert ${this.state.colorMessage}`} role="alert">{this.state.message}</div>:''; 
    return (
      <form onSubmit = {this.handleSubmit} className="Registrar">
				{ alert }
				<div className="form-group">
					<label htmlFor="email">Correo Electronico</label>
					<input 
						className="form-control" 
						type="email" 
						id="email"
						name="email"
						onChange = {this.handleChange}
						value = {this.state.email} 
						aria-describedby="emailHelp" 
						placeholder="Enter email"
					/>
					<small id="emailHelp" className="form-text text-muted">No compartas tu correo con nadie</small>
				</div>
				<div className="form-group">
					<label htmlFor="password">Contraseña</label>
					<input 
						className="form-control" 
						type="password" 
						id="password" 
						name="password"
						onChange = {this.handleChange}
						value = {this.state.password}
						placeholder="Contraseña"/>
				</div>
				<div className="form-group">
					<label htmlFor="confirmPassword">Confirmar Contraseña</label>
					<input 
						className="form-control" 
						type="password" 
						id="confirmPassword" 
						name="confirmPassword"
						onChange = {this.handleChange}
						value = {this.state.confirmPassword}
						placeholder="Confirmar contraseña"/>
				</div>
				<div className="login__controls">
					<button type="submit" className="btn btn-primary">Submit</button>
				</div>
			</form>
    )
	}
	render(){
		if(!this.state.logged){
			return this._render()
		}
		return <Redirect from='/login' to='/perfil'/>
	}
}

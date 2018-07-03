import React, { Component } from 'react'

import { Redirect , Link } from 'react-router-dom';

import './Login.css';

import firebase from 'firebase/app';

export default class Login extends Component {
	constructor(props){
		super(props);
		this.state = {
			email: '',
			password: '',
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
		const { email , password } = this.state;
		firebase.auth().signInWithEmailAndPassword(email,password)
			.then(response=>{
				this.setState({
					logged: true,
					message: 'Usted esta loggeado',
					colorMessage: 'alert-success'
				});
			})
			.catch(err=>{
				this.setState({
					message: 'Su correo o contraseña son incorrectos',
					colorMessage: 'alert-danger'
				});
			});
	}
  _render() {
		const alert = this.state.message ?<div className={`alert ${this.state.colorMessage}`} role="alert">{this.state.message}</div>:''; 
    return (
      <form onSubmit = {this.handleSubmit} className="Login">
				{alert}
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
						placeholder="Password"/>
				</div>
				<div className="login__controls">
					<button type="submit" className="btn btn-primary">Submit</button>
					<Link to="/registrar">Registrar</Link>
				</div>
			</form>
    )
	}
	render(){
		if(!this.state.logged){
			return this._render()
		}
		return <Redirect from='/login' to='/inicio'/>
	}
}

import React, { Component } from 'react'
import FileUpload from '../../FileUpload/FileUpload';
import GroupInput from '../../GroupInput/GroupInput';
import './Perfil.css';

import { inject , observer } from 'mobx-react';
import firebase from 'firebase/app';

@inject('store') @observer
export default class PerfilLoading extends Component{
	render(){
		if(this.props.store.user && this.props.store.user.uid){
			return <Perfil user = {this.props.store.user}/>
		}
		return '';
	}
}


class Perfil extends Component {
	constructor(props){
		super(props);
		this.state = {
			
			urlPhoto: '',
			username:'',
			descripcion: '',
			tipo: '',
			direccion: '',

			modificado: false,
			definido: false,

			checkBoxs:[
        { id: ''          , label: 'Ninguno  '},
        { id: 'comensal'  , label: 'Comensal' },
        { id: 'anfitrion' , label: 'Anfitrion'},
        { id: 'cocinero'  , label: 'Cocinero' },
        { id: 'ayudante'  , label: 'Ayudante' }
      ]
		}
	}

	componentDidMount(){
		this.profileRef = firebase.database().ref(`/profiles/${this.props.user.uid}`);
		this.profileRef.on('value',snap=>{
			const userProfile = snap.val();			
			if(userProfile){
				const { username , descripcion, tipo, urlPhoto , direccion } = userProfile;
				this.setState({
					username: username || '',
					descripcion: descripcion || '',
					tipo: tipo || '',
					urlPhoto: urlPhoto || '',
					direccion: direccion || '',
					definido: tipo!==''? true: false
				});
			}
		});
		

	}
	componentWillUnmount(){
		this.profileRef.off('value');
	}
	saveDownloadURL = (downloadURL) => {
		this.setState({
			urlPhoto: downloadURL,
			modificado: true
		});
	}
	handleSubmit = (e) => {
		e.preventDefault();
		let profile = {
			username: this.state.username,
			descripcion: this.state.descripcion,
			urlPhoto: this.state.urlPhoto,
			tipo: this.state.tipo
		};
		switch(this.state.tipo){
			case 'anfitrion':
				profile = {
					...profile,
					direccion: this.state.direccion
				}
				break;
			case 'cocinero':
				profile = {
					...profile,
					platos: []
				}
				break;
			case 'ayudante':
				profile = {
					...profile,
					habilidades: []
				}
				break;
			default:
				break;
		}
		this.profileRef.set(profile);
		this.setState({
			modificado: false
		});
	}
	handleChange = (e) => {
		const { name , value } = e.target;
		this.setState({
			[name]: value,
			modificado: true
		});
	}
  render() {

		let infoExtra = null;
		if(this.state.tipo){
			switch(this.state.tipo){
				case 'comensal':
					break;
				case 'anfitrion':
					infoExtra =(
						<div>
							<GroupInput text = "Direccion" value = { this.state.direccion } handleChange = { this.handleChange }/>
						</div>
					) 
					break;
				case 'cocinero':
					infoExtra = (
						<div>
							Lista de platos
						</div>
					);
					break;
				case 'ayudante':
					infoExtra = (
						<div>
							Lista de cosas que sabe hacer
						</div>
					);
					break;
				default:
					break;
			}
		}
		
    return (
      <form className="Perfil" onSubmit = { this.handleSubmit }>
				<div className="Perfil__left">
					<FileUpload saveDownloadURL = { this.saveDownloadURL } url = { this.state.urlPhoto }/>
				</div>
				<div className="Perfil__right">
					<GroupInput text = "Username" value = { this.state.username } handleChange = { this.handleChange } />
					<GroupInput text = "Descripcion" value = { this.state.descripcion } handleChange = { this.handleChange }/>
					<Select tipo = { this.state.tipo } definido = { this.state.definido } checkBoxs = { this.state.checkBoxs } handleChange = { this.handleChange }/>
					{ infoExtra }
					<input type="submit" value="guardar" disabled = {!this.state.modificado}/>
				</div>
			</form>
    )
  }
}

class Select extends Component{
	renderOptions(){
    return this.props.checkBoxs.map((checkbox, index)=>{
      return(
        <option key={checkbox.id} value={checkbox.id}>{checkbox.label}</option>
      );
    });
  }
	render(){
		return (
		<div className="input-group mb-3">
				
			<div className="input-group-prepend">
				<label className="input-group-text" htmlFor="inputGroupSelect01">Tipo de Usuario</label>
			</div>

				<select className="custom-select" 
					name="tipo" id="selectGroup" 
					value={ this.props.tipo } 
					onChange = { this.props.handleChange }
					disabled = { this.props.definido }
				>

					{this.renderOptions()}
			
				</select>
		</div>
		);
	}
}
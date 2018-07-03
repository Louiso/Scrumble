import React, { Component } from 'react'
import GroupInput from '../../GroupInput/GroupInput';
import FileUpload from '../../FileUpload/FileUpload';

import { inject , observer } from 'mobx-react';

import firebase from 'firebase/app';

import './PostAdd.css';
import { addUserProfilePost } from '../../../helpers/User';
import { crearPost } from '../../../helpers/Post';

@inject('store') @observer
export default class PostAddLoading extends Component{
	render(){
		if(this.props.store.user && this.props.store.user.uid){
			return(
				<PostAdd user = {this.props.store.user }/>
			);
		}
		return ''
	}
}

class PostAdd extends Component {
	constructor(props){
		super(props);
		this.state = {
			titulo: '',
			descripcion:'',
			urlPhoto: '',
			messages: [],
			colorMessage: '',
			userProfile: null,
			focus: false
		}
	}
	componentDidMount = async ()=>{
		this.userProfileRef = firebase.database().ref(`/profiles/${this.props.user.uid}`);
		this.userProfileRef.on('value',snap=>{
			const userProfile = snap.val();
			this.setState({
				userProfile
			});
		});
	}
	componentWillUnmount(){
		this.userProfileRef.off('value');
	}
	saveDownloadURL = (downloadURL) => {
		this.setState({
			urlPhoto: downloadURL
		});
	}
	handleChange = (e) => {
		const { name, value } = e.target;
		this.setState({
			[name]: value
		});
	}
	buscarErrores(){
		const { titulo , descripcion, urlPhoto } = this.state;
		const messages = [];
		if(!titulo){
			messages.push({
				text: 'completar titulo'
			});
		}
		if(!descripcion){
			messages.push({
				text: 'completar descripcion'
			});
		}
		if(!urlPhoto){
			messages.push({
				text: 'falta subir foto'
			});
		}

		return messages;
	}


	handleSubmit = async (e) => {
		e.preventDefault();
		const { titulo , descripcion, urlPhoto } = this.state;
		
		const messages = this.buscarErrores();
		
		if( messages.length > 0 ){
			this.setState({
				messages: messages,
				colorMessage: 'alert-danger'
			});
			return;
		}else{

			const keyPost =  await crearPost({
				titulo,
				descripcion,
				urlPhoto,
				userId: this.props.user.uid
			});

			await addUserProfilePost(this.props.user.uid, keyPost , { titulo });

			this.setState({
				messages: [],
				titulo: '',
				descripcion: '',
				urlPhoto: '',
				focus:false
			})
		}
	}

	renderMessages(){
		return this.state.messages.map( (message,index) => {
			return(
				<div  key = {index} className={`alert ${this.state.colorMessage}`} role="alert">
					{ message.text }
				</div>
			);
		});
	}

	handleFocus = () => {
		this.setState({
		 	focus:true
		});
	}
	handleBlur = () => {
		this.setState({
			focus: false
		});
	}
	render() {
		
		if(!this.state.userProfile || this.state.userProfile.tipo === 'comensal'){
			return '';
		}

		if(!this.state.focus){
			return (
				<form className = "PostAdd" onSubmit = { this.handleSubmit }>
				{ this.renderMessages() }
				<GroupInput text = "Titulo" onFocus={this.handleFocus} value = { this.state.titulo } handleChange = {this.handleChange}/>
      </form>
			);
		}

    return (
      <form className = "PostAdd" onSubmit = { this.handleSubmit }>
				{ this.renderMessages() }
				<GroupInput text = "Titulo" value = { this.state.titulo } handleChange = {this.handleChange}/>
				<GroupInput text = "Descripcion" value = { this.state.descripcion } handleChange = {this.handleChange}/>
				<FileUpload saveDownloadURL = { this.saveDownloadURL } url = { this.state.urlPhoto }/>

				<input type="submit" value="publicar"/>
      </form>
    )
  }
}

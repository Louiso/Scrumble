import React, { Component } from 'react'

import './FileUpload.css';

import firebase from 'firebase/app';

// Solo se usara este componente si el usuario se ha cargado
export default class FileUpload extends Component {
	constructor(props){
		super(props);
		this.state = {
			url: 'https://tierock.files.wordpress.com/2014/06/very-basic-file-icon1.png',
			progress: 0,
			loading: false
		}
	}	
	handleChange = (e) => {

		const file = e.target.files[0];
		const user = firebase.auth().currentUser;
		this.imageProfileStorageRef = firebase.storage().ref('/').child(`/profiles/${user.uid}/images/${file.name}`);
		const task = this.imageProfileStorageRef.put(file);
		task.on('state_changed',
			snap=>{
				const porcentaje = (snap.bytesTransferred/snap.totalBytes) * 100;
        this.setState({
					progress: porcentaje,
					loading: true
				});
			},
			error=>{
				console.log(error.message);
			},
			()=>{
				this.imageProfileStorageRef.getDownloadURL()
					.then(downloadURL=>{
						this.props.saveDownloadURL(downloadURL);
						this.setState({
							url: downloadURL,
							progress: 100,
							loading: false
						});
					});
			}
		);
	}
  render() {
		let progress = null;
		if(this.state.loading){
			progress = <progress value={this.state.progress} max="100"></progress>; 
		}
    return (
      <div className="FileUpload">
				<div className="img_preview_container">
					<img src={this.props.url || this.state.url} alt="url"/>
				</div>
				{ progress }
				<div>
					<label htmlFor="fileUpload">Subir Archivo</label>
					<input id="fileUpload" type="file" onChange={this.handleChange}/>
				</div>
			</div>
    )
  }
}

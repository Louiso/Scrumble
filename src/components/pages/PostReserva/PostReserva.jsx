import React, { Component } from 'react'

import 'react-datepicker/dist/react-datepicker.css';

import './PostReserva.css';

import BotonReservar from './BotonReservar/BotonReservar';
import FormReservar from './FormReservar/FormReservar';
import firebase from 'firebase/app';

export default class PostReserva extends Component {
  constructor(props){
    super(props);
    this.state = {
      post: null,
      creadorPost: null,
      formActived: false,
      userProfile: null
    }
  }
  
  valueCreatorPost = (snap)=>{
    const creadorPost = snap.val();
    creadorPost.key = snap.key;
    this.setState({
      creadorPost
    });
  }

  setUserProfile = (userProfile) => {
    this.setState({
      userProfile
    });
  }

  valuePost = (snap)=>{
    const post = snap.val();
    post.key = snap.key;
    
    this.creadorPostRef = firebase.database().ref(`/profiles/${post.userId}`);
    this.creadorPostRef.on('value',this.valueCreatorPost);

    this.setState({
      post
    });


  }
  componentDidMount = () => {

    /* DATOS DEL POST */
    this.postRef = firebase.database().ref(`/posts/${this.props.match.params.id}`);
    this.postRef.on('value',this.valuePost);
    
  }
  componentWillUnmount(){
    this.postRef.off('value',this.valuePost);
    this.creadorPostRef.off('value',this.valueCreatorPost);
  }
  handleReservar = () => {
    this.setState({
      formActived: true
    });
  }
  _loading(){
    return (
      <div>
        
      </div>
    );
  }
  
  render() {
    const { post , creadorPost } = this.state;
    
    if( post && creadorPost ){

      return(
        <div className = "PostReserva">
          <div className="jumbotron">
            <h1 className="display-3">{post.titulo}</h1>
            <p className="lead">{post.descripcion}</p>
            <BotonReservar onClick = {this.handleReservar} setUserProfile = {this.setUserProfile}/>
          </div>

          <div className="row marketing">
            <div className="col-lg-12">
              <h4>Local</h4>
              <p>{creadorPost.username}</p>


              <h4>Descripcion</h4>
              <p>{creadorPost.descripcion}</p>

              { creadorPost.direccion ?(
                <div>
                  <h4>Direccion</h4>
                  <p>{creadorPost.direccion}</p>
                </div>
              ):''}
              
              { this.state.formActived? <FormReservar creadorPost = {this.state.creadorPost} post={this.state.post} userProfile={this.state.userProfile}/> : ''}
              {/* FALTA AGREGAR LAS ESTRELLAS */}
              {/* <h4>Subheading</h4>
              <p>Maecenas sed diam eget risus varius blandit sit amet non magna.</p> */}
            </div>
          </div>
        </div>
      );
      
    }
    return this._loading();
  }
}

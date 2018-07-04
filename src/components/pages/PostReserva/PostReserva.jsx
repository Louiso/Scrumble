import React, { Component } from 'react'

import 'react-datepicker/dist/react-datepicker.css';

import './PostReserva.css';

import BotonReservar from './BotonReservar/BotonReservar';
import FormReservar from './FormReservar/FormReservar';

import PostController from '../../../controllers/Post';
import UserController from '../../../controllers/User';

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
  
  setUserProfile = (userProfile) => {
    this.setState({
      userProfile
    });
  }
 
  componentDidMount = async () => {

    /* DATOS DEL POST */
    this.post = new PostController(this.props.match.params.id);
    const post = await this.post.getPost();
    
    this.user = new UserController(post.userId);
    const creadorPost = await this.user.getUserProfile();

    this.setState({
      creadorPost,
      post
    });
      

  }
  componentWillUnmount(){
    this.post.destroy();
    this.user.destroy();
  }
  handleReservar = () => {
    this.setState({
      formActived: true
    });
  }
  _loading(){
    return (
      <div>
        ... Loading
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

import firebase from 'firebase/app';
import { Controller } from './Controller';

export default class UserController extends Controller{

  setId(id){
    this.id = id;
    this.ref = firebase.database().ref(`/profiles/${id}`);
  }

  /* PROFILE */
  addUserProfile(userProfile){
    
    const ref = firebase.database().ref().child(`/profiles`);
    return this.__addData(ref, userProfile);

  } 

  setUserProfile(profile){
    this.__setData(this.ref,profile);
  }

  getUserProfile(){
    
    const ref = this.ref;
    return this.__getData(ref);
  
  }

  /* PROFILE/POSTS */
  
  getPostsRealTime(getCallback, updateCallback, removeCallback){

    const ref = this.ref.child(`/posts`);
    this.__realTime(ref,getCallback,updateCallback,removeCallback);
    
  }

  addPost(post){
    
    const ref = this.ref.child(`/posts`);
    return this.__addData(ref,post);

  }

  setPost(id, data){
    const ref = this.ref.child(`/posts/${id}`);
    this.__setData(ref,data);
  }

  getPost(id){
  
    const ref = this.ref.child(`/posts/${id}`);
    return this.__getData(ref);
  
  }


  /* PROFILE/NOTIFICACIONES */

  getNotificationsRealTime(getCallback, updateCallback, removeCallback){ 

    const ref = this.ref.child(`/notificaciones`);
    this.__realTime(ref,getCallback, updateCallback, removeCallback);
  
  }

  addNotificacion(notificacion){
    
    const ref = this.ref.child(`/notificaciones`);
    return this.__addData(ref,notificacion);

  }

  setNotificacion(id, data){
    const ref = this.ref.child(`/notificaciones/${id}`);
    this.__setData(ref,data);
  }

  getNotificacion(id){
  
    const ref = this.ref.child(`/notificaciones/${id}`);
    return this.__getData(ref);
  
  }

  /* PROFILE/RESERVAS */

  getReservacionesRealTime(getCallback,updateCallback,removeCallback){
    const ref = this.ref.child(`/reservas`);
    this.__realTime(ref,getCallback, updateCallback, removeCallback);
  }

  addReserva(reserva){
    
    const ref = this.ref.child(`/reservas`);
    return this.__addData(ref,reserva);

  }

  setReserva(id, reserva){
    const ref = this.ref.child(`/reservas/${id}`);
    this.__setData(ref,reserva);
  }

  getReserva(id){
  
    const ref = this.ref.child(`/reservas/${id}`);
    return this.__getData(ref);
  
  }

}
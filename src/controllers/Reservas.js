import { Controller } from "./Controller";

import firebase from 'firebase/app';

export default class ReservaController extends Controller{
  setId(id){
    this.id = id;
    this.ref = firebase.database().ref(`/reservas/${id}`);
  }

  getReservasRealTime(getCallback, updateCallback, removeCallback){
    const ref = firebase.database().ref(`/reservas`);
    this.__realTime(ref, getCallback, updateCallback, removeCallback);
  }

  setReserva(reserva){
    this.__setData(this.ref,reserva);
  }
  getReserva(){
    const ref = this.ref;
    return this.__getData(ref);
  }

  addReserva(reserva){
    const ref = firebase.database().ref(`/reservas`);
    return this.__addData(ref,reserva);
  }
}
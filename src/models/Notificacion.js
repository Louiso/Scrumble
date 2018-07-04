import moment from 'moment';

export default class NotificacionModel{
  constructor(emisor, receptor, origen, tipo, fechaCreacion = moment()){
    this.emisor = emisor;
    this.receptor = receptor;
    this.origen = origen;
    this.tipo = tipo;
    this.fechaCreacion = fechaCreacion;
  }
}
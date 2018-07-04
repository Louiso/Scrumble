export default class ReservaModel{
  constructor(emisor, receptor, nAsientos, fechaReserva, confirmado, completado, cancelado, fechaCreacion){
    this.emisor = emisor;
    this.receptor = receptor;
    this.nAsientos = nAsientos;
    this.fechaReserva = fechaReserva;
    this.confirmado = confirmado;
    this.completado = completado;
    this.cancelado = cancelado;
    this.fechaCreacion = fechaCreacion;
  }
}

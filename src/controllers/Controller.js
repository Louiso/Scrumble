export class Controller{
  constructor(id){
    if(id){
      this.setId(id);
    }
    this.events = [];
  }
  setId(){

  }
  destroy(){
    this.events.forEach(({ ref , callback , type })=>{
      ref.off(type,callback);
    });
  }
}
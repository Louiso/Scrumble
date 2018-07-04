export class Controller{
  constructor(id){
    if(id){
      this.setId(id);
    }
    this.events = [];
  }
  setId(){

  }

  __realTime(ref, getCallback, updateCallback , removeCallback){
    let callback;
    //////////////////////////////////////////////
    if(getCallback){
      callback = (snapChild)=>{
        const notificacion = snapChild.val();
        notificacion.key = snapChild.key;
        getCallback(notificacion);
      };
  
      ref.on('child_added',callback);
  
      this.events.push({
        ref,
        callback,
        type: 'child_added',
      });
    }

    ////////////////////////////////////////////
    if(updateCallback){
      callback = (snapChild) =>{
        const notificacion = snapChild.val();
        notificacion.key = snapChild.key;
        updateCallback(notificacion);
      } 
  
      ref.on('child_changed',callback);
  
      this.events.push({
        ref,
        callback,
        type: 'child_changed',
      });
    }

    if(removeCallback){
      callback = (snapChild)=>{
        const notificacion = snapChild.val();
        notificacion.key = snapChild.key;
        removeCallback(notificacion);
      }
  
      ref.on('child_removed',callback);
  
      this.events.push({
        ref,
        callback,
        type: 'child_removed',
      });
    }

  }

  __getData(ref){

    return new Promise((resolve)=>{
      const callback = (snap)=>{
        if(snap.val()){
          const data = snap.val();
          data.key = snap.key;
          resolve(data);
        }else{
          resolve(null);
        }
        
      }
      ref.on('value',callback);
      this.events.push({
        ref,
        callback,
        type: 'value',
      });

    });
  }

  __addData(ref,data){
    return new Promise((resolve,reject)=>{
      const key = ref.push().key;
      ref.child(`/${key}`).set(data)
        .then((/* VACIO */)=>{
          resolve(key);
        })
        .catch((error)=>{
          reject(error);
        });
    });
  }

  __setData(ref,data){
    return new Promise((resolve,reject)=>{
      ref.set(data)
        .then(()=>{
          resolve();
        })
        .catch((error)=>{
          reject(error);
        });
      
    });
  }

  __removeData(ref){
    return new Promise((resolve,reject)=>{
      ref.remove()
        .then(()=>{
          resolve();
        })
        .catch((error)=>{
          reject(error);
        });
    });
  }

  destroy(){
    this.events.forEach(({ ref , callback , type })=>{
      ref.off(type,callback);
    });
  }
}
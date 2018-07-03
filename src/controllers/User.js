import firebase from 'firebase/app';
import { Controller } from './Controller';

export default class UserController extends Controller{
  constructor(id){
    super(id);
    this.events = [];

  }

  setId(id){
    this.id = id;
    this.ref = firebase.database().ref(`/profiles/${id}`);
  }

  static addUserProfile(userProfile){
    return new Promise((resolve, reject)=>{
      const ref = firebase.database().ref().child(`/profiles`);
      ref.push().set(userProfile)
        .then(()=>{
          resolve();
        })
        .catch((error)=>{
          reject(error);
        });
    });
  } 

  setUserProfile(profile){
    return new Promise((resolve)=>{
      this.ref.set(profile);
      resolve();
    });
  }

  getUserProfile(){
    return new Promise((resolve)=>{
      const ref = this.ref;

      const callback = (snap)=>{
        if(snap.val()){
          const userProfile = snap.val();
          userProfile.key = snap.key;
          resolve(userProfile);
        }else{
          resolve(null);
        }
        
      };

      ref.on('value',callback);
      
      this.events.push({
        ref,
        callback,
        type: 'value'
      });
    });
  }

  addNotificacion(notificacion){
    return new Promise((resolve,reject)=>{
      const ref = this.ref.child(`/notificaciones`);
      ref.push().set(notificacion)
        .then((algo)=>{
          resolve(algo);
        })
        .catch((error)=>{
          reject(error);
        });;
    });
  }

  getPost(id){
    return new Promise((resolve)=>{
      const ref = this.ref.child(`/notificaciones/${id}`);
      const callback = (snap)=>{
        const post = snap.val();
        post.key = snap.key;
        resolve(post);
      }
      ref.on('value',callback);
      this.events.push({
        ref,
        callback,
        type: 'value',
      });

    });
  }

  getPostsRealTime(getCallback, updateCallback, removeCallback){

    const ref = this.ref.child(`/posts`);
    let callback;

    //////////////////////////////////////////////

    /* GET */
    if(getCallback){

      callback = (snapChild)=>{
        const post = snapChild.val();
        post.key = snapChild.key;
        getCallback(post);
      };
  
      ref.on('child_added',callback);
  
      this.events.push({
        ref,
        callback,
        type: 'child_added',
      });
    }

    ////////////////////////////////////////////
    /* UPDATE */
    if(updateCallback){
      callback = (snapChild) =>{
        const post = snapChild.val();
        post.key = snapChild.key;
        updateCallback(post);
      } 
  
      ref.on('child_changed',callback);
  
      this.events.push({
        ref,
        callback,
        type: 'child_changed',
      });
    }
    /////////////////////////////////////////////
    /* REMOVE */
    if(removeCallback){
      callback = (snapChild)=>{
        const post = snapChild.val();
        post.key = snapChild.key;
        removeCallback(post);
      }
  
      ref.on('child_removed',callback);
  
      this.events.push({
        ref,
        callback,
        type: 'child_removed',
      });  
    }
    
  }

  addPost(post){
    return new Promise((resolve,reject)=>{
      const ref = this.ref.child(`/posts`);
      ref.push().set(post)
        .then((/* VACIO */)=>{
          resolve();
        })
        .catch((error)=>{
          reject(error);
        });
    });
  }

  getNotificationsRealTime(getCallback, updateCallback, removeCallback){
    
    const ref = this.ref.child(`/notificaciones`);
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

}
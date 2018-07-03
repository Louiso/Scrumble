import firebase from 'firebase/app';

export default class User{
  constructor(id){

    this.ref = firebase.database().ref(`/profiles/${id}`);
    this.events = [];

  }

  static addUserProfile(userProfile){
    return new Promise((resolve, reject)=>{
      const ref = firebase.database().ref(`/profiles`);
      ref.push().set(userProfile)
        .then(()=>{
          resolve();
        })
        .catch((error)=>{
          reject(error);
        });
    });
  } 

  getUserProfile(){
    return new Promise((resolve)=>{
      const ref = this.ref;

      const callback = (snap)=>{
        const userProfile = snap.val();
        userProfile.key = snap.key;
        resolve(userProfile);
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
      const ref = this.ref(`/notificaciones`);
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
      const ref = this.ref(`/notificaciones/${id}`);
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

      const ref = this.ref.ref(`/posts`);

      //////////////////////////////////////////////
      /* GET */
      let callback = (snapChild)=>{
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

      ////////////////////////////////////////////
      /* UPDATE */
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
      /////////////////////////////////////////////
      /* REMOVE */
      callback = (snapChild)=>{
        const post = snapChild.val();
        post.key = snapChild.key;
        removeCallback(post);
      }

      ref.on('child_remove',callback);

      this.events.push({
        ref,
        callback,
        type: 'child_changed',
      });

  }

  addPost(post){
    return new Promise((resolve,reject)=>{
      const ref = this.ref(`/post`);
      ref.push().set(post)
        .then((/* VACIO */)=>{
          resolve();
        })
        .catch((error)=>{
          reject(error);
        });;
    });
  }

  getNotificationsRealTime(getCallback, updateCallback, removeCallback){
      const ref = this.ref.ref(`/notificaciones`);

      //////////////////////////////////////////////
      let callback = (snapChild)=>{
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

      ////////////////////////////////////////////

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

      callback = (snapChild)=>{
        const notificacion = snapChild.val();
        notificacion.key = snapChild.key;
        removeCallback(notificacion);
      }

      ref.on('child_remove',callback);

      this.events.push({
        ref,
        callback,
        type: 'child_changed',
      });

  }

  destroy(){
    this.events.forEach(({ ref , callback , type })=>{
      ref.off(type,callback);
    });
  }
}
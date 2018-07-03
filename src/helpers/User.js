import firebase from 'firebase/app';


const getUserProfile = (id) => {
    const ref = firebase.database().ref(`/profiles/${id}`);
    return new Promise((resolve) =>{
        ref.on('value',snap=>{
            resolve({
                snap,
                ref
            });
        });
    });
}

const addUserProfilePost = (id,keyPost,post) => {
    const ref = firebase.database().ref(`/profiles/${id}`);
    return new Promise((resolve,reject)=>{
        ref.child(`/posts/${keyPost}`).set(post)
            .then((res)=>{
                resolve(res);
            })
            .catch((error)=>{
                reject(error);
            });
    });
}


/* VER DE ALGUNA FORMA DE OBTENER DATA Y QUE SE ACTUALICE SOLO */
const getUserProfileNotificationsSinVer = (id, callback) => {
    const ref = firebase.database().ref(`/profiles/${id}/notificaciones`);
    return new Promise((resolve)=>{
        // Solo permite obtener datos, pero no alerta sobre los cambios de sus hijos
        ref.on('child_added',(snap)=>{
            const notificacion = snap.val();
            notificacion.key = snap.key;
            if(!notificacion.visto){
                callback(notificacion);
            }
            resolve({ref});
        })
        
    });
}

const getUserProfileNotificationsSinVerUpdate = ( id, callback )=>{
    const ref = firebase.database().ref(`/profiles/${id}/notificaciones`);
    return new Promise((resolve)=>{
        // Solo permite obtener datos, pero no alerta sobre los cambios de sus hijos
        ref.on('child_changed',(snapChild)=>{
            const notificacion = snapChild.val();
            notificacion.key = snapChild.key;
            if(!notificacion.visto){
                callback(notificacion);
            }
            resolve({ref});
        })
        
    });
}

const addUserProfileNotificacion = (id,notificacion) => {
    const ref = firebase.database().ref(`/profiles/${id}`);
    return new Promise((resolve,reject)=>{

        const key = ref.child('/notificaciones/').push().key;
        
        ref.child(`/notificaciones/${key}`).set(notificacion)
            .then((res)=>{
                resolve(key);
            })
            .catch((error)=>{
                reject(error);
            });
    
    });
}

export {
    getUserProfile,
    addUserProfilePost,
    addUserProfileNotificacion,
    getUserProfileNotificationsSinVer,
    getUserProfileNotificationsSinVerUpdate
}
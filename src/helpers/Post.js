import firebase from 'firebase/app';

const getPost = (id) => {
    
    return new Promise((resolve,reject)=>{

        const ref = firebase.database().ref(`/posts/${id}`);
        ref.on('value',snap=>{
            resolve({
                snap,
                ref
            });
        });
    });

}


const crearPost = (post) => {
    return new Promise((resolve, reject)=>{
        const ref = firebase.database().ref(`/posts`);
        const key = ref.push().key;
        ref.child(`/${key}`).set(post)
        resolve(key);
    });
}


export {
    getPost,
    crearPost
}
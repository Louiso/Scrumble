import firebase from 'firebase/app';
import { Controller } from './Controller';

export default class PostController extends Controller{
  constructor(id){
    super(id);
    this.events = [];

  }

  setId(id){
    this.id = id;
    this.ref = firebase.database().ref(`/posts/${id}`);
  }

  getPostsRealTime(getCallback, updateCallback, removeCallback){

    const ref = firebase.database().ref(`/posts`);
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

}
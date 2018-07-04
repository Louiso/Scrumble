import firebase from 'firebase/app';
import { Controller } from './Controller';

export default class PostController extends Controller{

  setId(id){
    this.id = id;
    this.ref = firebase.database().ref(`/posts/${id}`);
  }

  getPostsRealTime(getCallback, updateCallback, removeCallback){

    const ref = firebase.database().ref(`/posts`);
    this.__realTime(ref, getCallback, updateCallback, removeCallback);

  }

  getPost(){
    const ref = this.ref;
    return this.__getData(ref);
  }

  addPost(post){
    const ref = firebase.database().ref(`/posts`);
    return this.__addData(ref,post);
  }

}
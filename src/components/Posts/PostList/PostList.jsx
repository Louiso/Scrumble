import React, { Component } from 'react'

import './PostList.css';

import firebase from 'firebase/app';
import Post from '../Post/Post';

export default class PostList extends Component {
  constructor(props){
    super(props);
    this.state = {
      posts: []
    }
  }
  componentDidMount = () => {
    this.postsRef = firebase.database().ref('/posts');
    this.postsRef.on('child_added',snap=>{
      const posts = this.state.posts;
      posts.push({
        ...snap.val(),
        key: snap.key
      }); 
      this.setState({
        posts
      });  
    }); 
  }
  componentWillUnmount(){
    this.postsRef.off('child_added');
  }
  renderPosts(){
    return this.state.posts.map(post=>{
      return(
        <Post key = {post.key} post = {post}/>
      );
    }).reverse();
  }
  render() {
    return (
      <div className="PostList">
        { this.renderPosts() }
      </div>
    )
  }
}

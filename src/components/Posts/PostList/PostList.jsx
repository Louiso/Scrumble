import React, { Component } from 'react'

import './PostList.css';

import Post from '../Post/Post';
import PostController from '../../../controllers/Post';

export default class PostList extends Component {
  constructor(props){
    super(props);
    this.state = {
      posts: []
    }
  }
  componentDidMount = () => {
    this.posts = new PostController();

    this.posts.getPostsRealTime((post)=>{
      const posts = this.state.posts;
      posts.push(post); 
      this.setState({
        posts
      });  
    }); 
  }
  componentWillUnmount(){
    this.posts.destroy();
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

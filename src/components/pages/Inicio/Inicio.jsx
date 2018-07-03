import React, { Component } from 'react'
import PostAdd from '../../Posts/PostAdd/PostAdd';
import PostList from '../../Posts/PostList/PostList';

// import firebase from 'firebase/app';


import './Inicio.css';

export default class Inicio extends Component {
  
  render() {
    return (
      <div className="Inicio">
        <PostAdd/>
        <PostList/>
      </div>
    )
  }
}

import React, { Component } from 'react'

import { Link } from 'react-router-dom';

import './Post.css';


export default class Post extends Component {
  render() {
    const { post } = this.props;
    
    const style = {
      '.mdl-card__title':{
        color: '#fff',
        backgroundImage: `url('${post.urlPhoto}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    }
    return (
      <div className="demo-card-square mdl-card mdl-shadow--2dp Post">
        <div className="mdl-card__title mdl-card--expand" style={style[".mdl-card__title"]}>
          <h2 className="mdl-card__title-text">{post.titulo}</h2>
        </div>
        <div className="mdl-card__supporting-text">
          {post.descripcion}
        </div>
        <div className="mdl-card__actions mdl-card--border">
          <Link to={`/posts/${post.key}`} className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
            Ver detalles
          </Link>
        </div>
      </div>
    )
  }
}

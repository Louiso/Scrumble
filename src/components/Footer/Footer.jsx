import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

@inject('store') @observer
export default class Footer extends Component {
	_render(){
		return(
			<div>
				Footer
			</div>
		);
	}
	_loading(){
		return this._render();
	}
	render() {
		if(this.props.store.user && this.props.store.user.uid){
			return this._render();
		}else{
			return this._loading();
		}
  }
}

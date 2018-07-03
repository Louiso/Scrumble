import React, { Component } from 'react'

export default class GroupInput extends Component {
  render() {
		const { text , value } = this.props;
    return (
    <div className="form-group">
			<label htmlFor={text}>{text}</label>
			<input 
				type="text" 
				id={text} 
				className="form-control" 
				value={ value }
				onFocus = { this.props.onFocus }
				name={text.toLowerCase()}
				onChange = { this.props.handleChange }
				placeholder={ text }
			/>
    </div>
    )
  }
}

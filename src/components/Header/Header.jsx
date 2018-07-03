import React, { Component } from 'react'
import Tab from './Tab/Tab';

const style = {
	'mdl-layout__header':{
		backgroundColor: 'var(--color-primario)',
	}
}

export default class Header extends Component {
	constructor(props){
		super(props);
		this.state = {
			tabSelected: 'Inicio',
			tabs:[
				{text : 'Inicio'},
				{text : 'Notificaciones'},
				{text : 'Reservas'}
			]
		};
	}
	handleClick = (tab) => {
		this.setState({
			tabSelected: tab.text
		});
	}
	renderTabs(){
		return this.state.tabs.map((tab,index)=>{
			return (
				<Tab key = {index} tab = {tab} onClick = { this.handleClick } tabSelected = { this.state.tabSelected }/>
			
			);
		});
	}
  render() {
    return (
      <header className="mdl-layout__header" style={style["mdl-layout__header"]}>
					<div className="mdl-layout__header-row">
						{/* <!-- Title --> */}
						<span className="mdl-layout-title">Fooders</span>
					</div>
					{/* <!-- Tabs --> */}
					<div className="mdl-layout__tab-bar mdl-js-ripple-effect">
						{this.renderTabs()}
					</div>
			</header>
    )
  }
}

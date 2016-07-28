import React from 'react';
import store from 'store';

require('assets/styles/callIn.scss');

export default React.createClass({
	handleSubmit: function(e){
		e.preventDefault();
	},
	close: function(e){
		e.preventDefault();
		store.dispatch({
			type: 'CHANGE_SHOWCALLIN',
			showCallIn: false
		})
	},
	render: function(){
		return (
			<div className="callInBox">
				<div className="shade"></div>
				<div className='request_box'>
					<div className="request_header">
						Request to: <span className="request_span">{this.props.request}</span>
						
					</div>
					<div className="request_message">
						You are requesting {(this.props.request === "Early Out") ? " an " : " a "} <span className="underline">{this.props.request}</span> for {this.props.fullDate}.
					</div>
					<div className="confirm"> Please click Submit to confirm. </div>
					<div className="request_buttons">
						<button className="employeeOptions" onClick={this.close}>Cancel</button>
						<button className="employeeOptions" onClick={this.handleSubmit}>Submit</button>
					</div>
				</div>
			</div>
		)
	}
})
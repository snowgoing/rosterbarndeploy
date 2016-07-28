import React from 'react';
import store from 'store';

require('assets/styles/confirm.scss');

export default React.createClass({
	close: function(){
		store.dispatch({
			type: 'CHANGE_SHOWCONFIRM',
			showConfirm: false
		})
	},
	confirmClear: function(){
		this.props.clearSchedule();
		store.dispatch({
			type: 'CHANGE_SHOWCONFIRM',
			showConfirm: false
		})
	},
	render: function(){
		return (
			<div className="confirmBox">
				<div className="shade"></div>
				<div className="confirmBox">
					<div className="confirmHeader">Clear Schedule
					</div>
					<div className="confirmMessage">
						Please confirm to clear schedule.
					</div>
					<div className="confirmButtons">
						<button onClick={this.close}>Cancel</button>
						<button onClick={this.confirmClear}>Confirm</button>
					</div>
				</div> 
				
			</div>
		)
	}
})
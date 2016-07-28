import React from 'react';
import store from 'store';
import EachEmployeeOnSchedule from 'ui/eachEmployeeOnSchedule';
import {v4} from 'uuid';

require('assets/styles/employeeToSchedule.scss');

export default React.createClass({
	render: function(){
		return (
					<div className="namesAcross">
						{this.props.item.map(function(thing, index){
							return (
								<EachEmployeeOnSchedule 
									key={thing.uniqueId} 
									thing={thing} />
							)
						}.bind(this))}
					</div>		
		)
	}
})
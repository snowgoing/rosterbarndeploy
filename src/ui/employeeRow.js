import React from 'react';
import EmployeeToSchedule from 'ui/employeeToSchedule';

export default React.createClass({
	render: function(){
		return (
			<div className="eachRow">
				{this.props.employeeWeeklySchedule.map(function(item, i){
					return (
							<EmployeeToSchedule key={i}  item={item} />
						)
				}.bind(this))}
			</div>
		)
	}
})
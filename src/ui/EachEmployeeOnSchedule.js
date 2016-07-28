import React from 'react';
import store from 'store';
import { setNewSchedule, sendEmployeeShiftObj, addEmployee, updateEmployee } from 'api/data';
import TimePicker from 'material-ui/TimePicker';

require('assets/styles/employeeToSchedule.scss');

export default React.createClass({
	getInitialState: function() {
		return {
			thing: this.props.thing,
			starting_time: this.props.thing.starting_time,
			nameString: this.props.thing.nameString,
			first_name: this.props.thing.first_name,
			last_name: this.props.thing.last_name,
			id: this.props.thing.id,
			photo_url: this.props.thing.photo_url,
			availability: this.props.thing.availability,
			station: this.props.thing.station,
			val: this.props.thing.val || ""
		}
	},
	
	handleBlur: function(e){
		var uniqueId = this.props.thing.uniqueId;

		this.setState({
			starting_time: this.refs.starting_time.value,
			station: this.refs.station.value
		});

		// setNewSchedule(uniqueId, this.props.sched, {
		// 	id: this.props.thing.id,
		// 	name: this.props.thing.name,
		// 	calendar_date: this.props.thing.calendar_date,
		// 	employee_id: this.props.thing.employee_id,
		// 	uniqueId: this.props.thing.uniqueId,
		// 	starting_time: this.refs.starting_time.value
		// });
		
		sendEmployeeShiftObj([{
			day: this.props.thing.calendar_date,
			employee: this.props.thing.id,
			starting_time: this.refs.starting_time.value
			// ,
			// station: this.refs.station.value
			
		}])
		console.log([{
			day: this.props.thing.calendar_date,
			employee: this.props.thing.id,
			starting_time: this.refs.starting_time.value
			// ,
			// station: this.refs.station.value
			
		}]);
	},
	handleChange: function(e) {
		// var value = e.target.value;
		// console.log('Hit handleChange');
		this.setState({
			starting_time: this.refs.starting_time.value,
			nameString: this.state.nameString,
			station: this.refs.station.value
		})
		store.dispatch({
			type: 'CHANGE_PUBLISHBUTTON',
			publishButton: "publish"
		})
	},
	handleNameBlur: function(e){
		var val = this.refs.nameString.value.split(" ") || "";
		console.log(this.state.id, {
				first_name: val[0], 
				last_name: val[1]
			});
		if(this.state.nameString !== this.refs.nameString.value) {
			updateEmployee(this.state.id, {
				first_name: val[0], 
				last_name: val[1]
			});
			// Consider page update here to reflect new roster.

		}

	},
	handleClick: function(e){
		store.dispatch({
			type: 'CHANGE_SHOWFORM',
			showForm: true
		})

		store.dispatch({
			type: 'THROW_EMPLOYEEINFO',
			employeeInfo: this.props.thing
		})
	},
	handleMouseOut: function(){
		store.dispatch({
			type: 'CHANGE_SHOWFORM',
			showForm: false
		})
	},
	render: function(){
		return (
				
					<div className="eachDay">
						
							<div className={this.props.thing.classInfoName} id="test">
								{(this.props.thing.nameString) 
									? 	<div className="nameImageBox">
											<div><img src={this.props.thing.photo_url} onClick={this.handleClick} /></div>
											<div className="nameIdBox">
												<div><input type="text" ref="nameString" value={this.props.thing.nameString}  onChange={this.handleChange} onBlur={this.handleNameBlur} className={this.props.thing.classInfoName} /></div> 
												<div className="idNum">{this.props.thing.employee_id}</div>
											</div>
										</div>
									: ""}
								{!(this.props.thing.nameString) 
									? 	<div className={"timeLocationBox " + this.props.thing.val}>
											<div><input onChange={this.handleChange} onBlur={this.handleBlur} ref="starting_time" defaultValue={this.props.thing.starting_time} /></div> 
											<div><input onChange={this.handleChange} onBlur={this.handleBlur} ref="station" defaultValue={this.props.thing.station} className="locationStyle "/></div>
										</div>
									: ""}
							</div>

					</div>
				
		)
	}
})
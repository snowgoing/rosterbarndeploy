import React from 'react';
import store from 'store';
import { updateEmployee, registerNewEmail } from 'api/data';

require('assets/styles/employeeInfoForm.scss');

export default React.createClass({
	getIntitalState: function(){
		return {
			
		}
	},
	close: function(){
		store.dispatch({
			type: 'CHANGE_SHOWFORM',
			showForm: false
		})

	},
	handleSubmit: function(e){
		e.preventDefault();
		if(this.props.info.email !== this.refs.email.value) {
			registerNewEmail({email: this.refs.email.value, profile_id: this.props.info.id})
		}
		console.log(this.props.info.id, {
			position_title: this.refs.position_title.value || "",
			first_name: this.refs.first_name.value || "",
			last_name: this.refs.last_name.value || "",
			employee_id: this.refs.employee_id.value || "",
			email: this.refs.email.value || "",
			phone_number: this.refs.phone_number_1.value + this.refs.phone_number_2.value + this.refs.phone_number_3.value  || ""
		});
		updateEmployee(this.props.info.id, {
			position_title: this.refs.position_title.value || "",
			first_name: this.refs.first_name.value || "",
			last_name: this.refs.last_name.value || "",
			employee_id: this.refs.employee_id.value || "",
			email: this.refs.email.value || "",
			phone_number: this.refs.phone_number_1.value + this.refs.phone_number_2.value + this.refs.phone_number_3.value  || ""
		});


		store.dispatch({
			type: 'CHANGE_SHOWFORM',
			showForm: false
		})

	},
	render: function(){
		return (
			<div>
			<div className="shade"></div>
			<div className="bigFlex">

			<div className="bigFlexHeader">Employee Info</div>
			<div className="employeeInfoFormBox">
				<div className="fullPic"><img src={this.props.info.photo_url} /></div>
				<div className="formBox">
					<label htmlFor="position_title">Position Title</label>
					<input ref="position_title" placeholder="Position Title" defaultValue={this.props.info.position_title}/>
					<label htmlFor="first_name">First Name</label>
					<input ref="first_name" placeholder="First Name" defaultValue={this.props.info.first_name}/>
					<label htmlFor="last_name">Last Name</label>
					<input ref="last_name" placeholder="Last Name" defaultValue={this.props.info.last_name}/>
					<label htmlFor="employee_id">Employee Id</label>
					<input ref="employee_id" placeholder="Employee Id" defaultValue={this.props.info.employee_id}/>
					<label htmlFor="email">Email</label>
					<input ref="email" placeholder="Email" defaultValue={this.props.info.email}/>
					<label htmlFor="phone_number">Phone Number</label>
					<div className="phoneNumber">
						<input ref="phone_number_1" defaultValue={this.props.info.phone_number.slice(0,3)} maxLength="3"/>
						<input ref="phone_number_2" defaultValue={this.props.info.phone_number.slice(3,6)} maxLength="3"/>
						<input ref="phone_number_3" defaultValue={this.props.info.phone_number.slice(6,10)} maxLength="4"/>
					</div>
					<label htmlFor="regular_days_off">Days Off</label>
					<input ref="regular_days_off" placeholder="Days Off" defaultValue={this.props.info.regular_days_off}/>
				</div>
			</div>
			<div className="formButtons">
				<button onClick={this.close}>Cancel</button>
				<button onClick={this.handleSubmit}>Submit</button>
			</div>

			</div>
			</div>
		)
	}
})
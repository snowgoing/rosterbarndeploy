import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import SidePanel from 'ui/sidePanel';
import EmployeeToSchedule from 'ui/employeeToSchedule';
import EmployeeInfoForm from 'ui/employeeInfoForm';
import Confirm from 'ui/confirm';
import { calendar, getWeekByWeek, getEmployeeSchedule, caltest, addNewEmployee, updateEmployee, sendEmployeeShiftObj } from 'api/data';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import store from 'store';

require("assets/styles/scheduler.scss");

var image = require("assets/images/logo2.png");
var month = new Date().getMonth(), 
	year = new Date().getFullYear(),
	date = new Date().getDate(),
	days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], 
	day = days[new Date().getDay()], 
	pythonMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
	months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],  
	forward = 0;

const Scheduler = React.createClass({
	refreshCurrentState: function(){
		var addOnEndpoint = ((this.props.shiftNum) ? "?shift_title=" + this.props.shiftNum : "");
		getEmployeeSchedule(year, pythonMonth[month], (date + forward), addOnEndpoint);
		getWeekByWeek(year, month, date + forward);
	},
	componentWillMount: function () {
		this.refreshCurrentState();
	},
	nextSchedule: function(){
		forward += 7;
		this.refreshCurrentState();
	},
	previousSchedule: function(){
		forward -= 7;
		this.refreshCurrentState();
	},
	addEmployee: function(e){
		e.preventDefault();
		addNewEmployee({
			first_name: "Add", 
			last_name: "Employee",
			availability: ((this.state.shiftNum) ? [this.state.shiftNum] : [1])
		});
		this.refreshCurrentState();
	},
	filterByShift: function(shift, type){
		var addOnEndpoint = ((shift) ? "?shift_title=" + shift : "");
		getEmployeeSchedule(year, pythonMonth[month], (date + forward), addOnEndpoint);
		getWeekByWeek(year, month, date + forward);
		store.dispatch({
			type: 'CHANGE_SHIFTBOX',
			shiftColor: type,
			shiftNum: ((shift) ? shift : "")
		})
	},
	printSchedule: function(){
		window.print();
	},
	confirmClear: function(){
		store.dispatch({
			type: 'CHANGE_SHOWCONFIRM',
			showConfirm: true
		})
	},
	clearSchedule: function(){
		var clearAll = [];
		var employees = this.props.employeeWeeklySchedule;
		for(let i = 0; i < employees.length; i++){
			for(let j = 0; j < 7; j++){
				clearAll.push({
					day: this.state.weeklyCalendar[j].calendar_date,
					employee: employees[i][j].id,
					starting_time: ""
				})
			}
		}
		sendEmployeeShiftObj(clearAll);
		this.refreshCurrentState();
	},
	setColor: function(val){
		var fieldToChange = val
		var test = [];
		var colors = ['red', 'yellow', 'pink', 'orange'];
		var cut = this.props.employeeWeeklySchedule;
		for(let i = 0; i < cut.length; i++){
			for(let j = 1; j < 8; j++){
				if(cut[i][j][fieldToChange]) {
					if(test.indexOf(cut[i][j][fieldToChange]) === -1){ 
						test.push(cut[i][j][fieldToChange]) 
					}
				}
			}
		}
		for(let i = 0; i < cut.length; i++){
			for(let j = 1; j < 8; j++){
				if(cut[i][j][fieldToChange]) {
					if(test.indexOf(cut[i][j][fieldToChange]) !== -1){ 
						cut[i][j].val =  colors[test.indexOf(cut[i][j][fieldToChange])]
					}
				}
			}
		}
		store.dispatch({
			type: 'GET_EMPLOYEEWEEKLYSCHEDULE',
			employeeWeeklySchedule: cut
		})
		// console.log('test', test);
		// console.log('cut', cut);
	},
	logout: function(){
		browserHistory.push('/')
	},
	render: function(){
		return (
			<div className="adminBg">

				<SidePanel dateString={this.props.weeklyCalendar[0].calendar_date} filterByShift={this.filterByShift} setColor={this.setColor} />

				<div className="adminHeader">
					<div>
					 <span className="roster"><span className="letter">R</span>oster</span><span className="barn"><span className="">B</span>arn</span>
					</div>
					<div className="headerOptions">
						<div className="options"><i className="fa fa-bars" aria-hidden="true"></i>Options</div>
						<div className="settings"><i className="fa fa-cogs" aria-hidden="true"></i>Settings</div>
						<div className="logout" onClick={this.logout} ><i className="fa fa-sign-out" aria-hidden="true"></i>Logout</div>
						
					</div>
				</div> 
				<div className="adminContainer">

					<div className="monthLabel">
						<div className={"shiftStatus " + this.props.shiftColor}>
							<div className="shiftTitle">{this.props.shiftColor}</div>
						</div>

						<div className="navigate">
							<div className="leftButton" onClick={this.previousSchedule}><i className="fa fa-angle-left" aria-hidden="true"></i></div>

							<div className="weekLabel"> {this.props.weeklyCalendar[0].monthString} {this.props.weeklyCalendar[0].day}, {this.props.weeklyCalendar[0].year}   

									<span className="dash"> - </span> 

								{this.props.weeklyCalendar[6].monthString} {this.props.weeklyCalendar[6].day}, {this.props.weeklyCalendar[6].year}
							</div> 
							<div className="rightButton" onClick={this.nextSchedule}><i className="fa fa-angle-right" aria-hidden="true"></i></div>
						</div>


						<div className="printClearButtons">
							<button onClick={this.confirmClear}>Clear Schedule</button>
							<button onClick={this.printSchedule}>Print Schedule</button>
						</div>

					</div>	

					

				<div className={"scheduleFlex " + this.props.flexbox_size}>
					
					<div className="schedule" >
						
						
						<div className="weekOf">
							<div className="roster employee"><span className="letter">R</span>oster<i className="fa fa-user-plus" aria-hidden="true" onClick={this.addEmployee}></i><span className="addUser"></span></div>
							
							{this.props.weeklyCalendar.map(function(item, i){
								return (
										<div key ={i} className="weekOfDay">
											<p>{item.dayString}<span>&#160;</span> {item.day}</p>
										</div>
								)
							}.bind(this))}  
							
						</div>
						
							<div className="eachRow">
						
								{this.props.employeeWeeklySchedule.map(function(item, i){
									return (
										<EmployeeToSchedule 
											key={i}  
											item={item} />
									)
								}.bind(this))}
							
							</div>
						
					</div>
				</div>
						
				</div>	

					<ReactCSSTransitionGroup transitionName="employeeBox" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
						{(this.props.showForm) 
							? <EmployeeInfoForm 
								info={this.props.employeeInfo} key={this.props.employeeInfo.uniqueId} /> 
							: ""}	
					</ReactCSSTransitionGroup>

					<ReactCSSTransitionGroup transitionName="employeeBox" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
						{(this.props.showConfirm) 
							? <Confirm
								key={1} clearSchedule={this.clearSchedule}/> 
							: ""}	 
					</ReactCSSTransitionGroup>

			</div>
		)
	}
})

const stateToProps = function(state) {
	return {
		weeklyCalendar: state.calendarReducer.weeklyCalendar,
		employeeWeeklySchedule: state.adminReducer.employeeWeeklySchedule,
		flexbox_size: state.calendarReducer.flexbox_size,
		shiftColor: state.cssReducer.shiftColor,
		shiftNum: state.cssReducer.shiftNum,
		showForm: state.showReducer.showForm,
		employeeInfo: state.employeeReducer.employeeInfo,
		showConfirm: state.showReducer.showConfirm
	}
}

export default connect(stateToProps)(Scheduler)
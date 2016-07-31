import React from 'react';
import store from '../store';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import SidePanel from '../components/sidePanel';
import EmployeeToSchedule from '../components/employeeToSchedule';
import EmployeeRow from '../components/employeeRow';
import EmployeeInfoForm from '../components/employeeInfoForm';
import Confirm from '../components/confirm';
import { addNewEmployee, getWeekByWeek, getEmployeeSchedule, updateEmployee, clearAllSchedule } from '../api/data';
// import { getWeekByWeek } from '../api/workspace'
import { browserHistory } from 'react-router';
import {v4} from 'uuid';
import RaisedButton from 'material-ui/RaisedButton';
import injectTapEventPlugin from 'react-tap-event-plugin';
import FlatButton from 'material-ui/FlatButton';
import Cookie from 'js-cookie';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

// require("assets/styles/scheduler.scss");
// var image = require("assets/images/logo2.png");
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], 
	day = days[new Date().getDay()], 
	months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

Date.prototype.addDays = function(days){
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

export default React.createClass({
	getInitialState: function() {
		console.log("hello", Cookie.get('token'));
		return ({
			currentDate: new Date(),
			employeeWeeklySchedule: [],
			flexbox_size: "",
			shiftColor: "",
			shiftNum: 0,
			showForm: false,
			employeeInfo: {},
			showConfirm: false
		})
	},
	componentWillMount: function(){
		this.unsubscribe = store.subscribe(function(){
			var currentStore = store.getState();
			this.setState({
				weeklyCalendar: currentStore.calendarReducer.weeklyCalendar,
				employeeWeeklySchedule: currentStore.adminReducer.employeeWeeklySchedule,
				flexbox_size: currentStore.calendarReducer.flexbox_size,
				shiftColor: currentStore.cssReducer.shiftColor,
				shiftNum: currentStore.cssReducer.shiftNum,
				showForm: currentStore.showReducer.showForm,
				employeeInfo: currentStore.employeeReducer.employeeInfo,
				showConfirm: currentStore.showReducer.showConfirm
			})
		}.bind(this));
		this.refreshCurrentState(new Date());
	},
	refreshCurrentState: function(dateObj, shiftId, clearAll){
		var departmentId = localStorage.getItem("departmentId");
		var shiftId = ((shiftId) ? shiftId : this.state.shiftNum);
		getEmployeeSchedule(dateObj, shiftId, departmentId, clearAll);
		getWeekByWeek(dateObj);
	},
	handleDateChange: function(next){
		var newWeekDate = this.state.currentDate.addDays(next);
		this.refreshCurrentState(newWeekDate);
		this.setState({
			currentDate: newWeekDate
		})
	},
	nextSchedule: function(){
		this.handleDateChange(7);
	},
	previousSchedule: function(){
		this.handleDateChange(-7);
	},
	addEmployee: function(e){
		addNewEmployee({
			first_name: "Add", 
			last_name: "Employee",
			availability: ((this.state.shiftNum) ? [this.state.shiftNum] : [1]),
			department: localStorage.getItem("departmentId")
		});
		this.refreshCurrentState(this.state.currentDate);
	},
	filterByShift: function(shiftId, type){
		this.refreshCurrentState(this.state.currentDate, shiftId)
		
		store.dispatch({
			type: 'CHANGE_SHIFTBOX',
			shiftColor: type,
			shiftNum: ((shiftId) ? shiftId : "")
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
		var shiftId = this.state.shiftNum;
		var employees = this.state.employeeWeeklySchedule;
		var clearAll = [];
		for(let i = 0; i < employees.length; i++){
			for(let j = 0; j < 7; j++){
				clearAll.push({
					day: this.state.weeklyCalendar[j].calendar_date,
					employee: employees[i][j].id,
					starting_time: ""
				})
			}
		}
		clearAllSchedule(clearAll);
		this.refreshCurrentState(this.state.currentDate, shiftId, true);
		;
	},
	setColor: function(val){
		var fieldToChange = val
		var test = [];
		var colors = ['red', 'yellow', 'pink', 'orange'];
		var cut = this.state.employeeWeeklySchedule;
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
		localStorage.clear();
		logout();
		Cookie.remove('token');
		store.dispatch({
			type: 'USER_LOGOUT'
		})
	
		// browserHistory.push('/')
	},
	render: function(){
		return (
			<div className="adminBg">

				<SidePanel dateString={this.state.weeklyCalendar[0].calendar_date} filterByShift={this.filterByShift} setColor={this.setColor} />

				<div className="adminHeader">
					<div>
					 <span className="roster"><span className="letter">R</span>oster</span><span className="barn"><span className="">B</span>arn</span>
					</div>
					<div className="headerOptions"><span className="departmentName">{localStorage.getItem("departmentTitle")}</span></div>
					<div className="headerOptions">
						<div className="options"><i className="fa fa-bars" aria-hidden="true"></i>Options</div>
						<div className="settings"><i className="fa fa-cogs" aria-hidden="true"></i>Settings</div>
						<div className="logout" onClick={this.logout} ><i className="fa fa-sign-out" aria-hidden="true"></i>Logout</div>
						
					</div>
				</div> 
				<div className="adminContainer">

					<div className="monthLabel">
						<div className={"shiftStatus " + this.state.shiftColor}>
							<div className="shiftTitle">{this.state.shiftColor}</div>
						</div>

						<div className="navigate">
							<div className="leftButton" onClick={this.previousSchedule}><i className="fa fa-angle-left" aria-hidden="true"></i></div>

							<div className="weekLabel"> {this.state.weeklyCalendar[0].monthString} {this.state.weeklyCalendar[0].day}, {this.state.weeklyCalendar[0].year}   

									<span className="dash"> - </span> 

								{this.state.weeklyCalendar[6].monthString} {this.state.weeklyCalendar[6].day}, {this.state.weeklyCalendar[6].year}
							</div> 
							<div className="rightButton" onClick={this.nextSchedule}><i className="fa fa-angle-right" aria-hidden="true"></i></div>
						</div>


						<div className="printClearButtons">
							<FlatButton label="Clear" primary={true} onClick={this.confirmClear} />
							<FlatButton label="Print" primary={true} onClick={this.printSchedule} />
						</div>

					</div>	

					

				<div className={"scheduleFlex " + this.state.flexbox_size}>
					
					<div className="schedule" >
						
						
						<div className="weekOf">
							<div className="roster employee"><span className="letter">R</span>oster<i className="fa fa-user-plus" aria-hidden="true" onClick={this.addEmployee}></i><span className="addUser"></span></div>
							
							{this.state.weeklyCalendar.map(function(item, i){
								return (
										<div key ={v4()} className="weekOfDay">
											<p>{item.dayString}<span>&#160;</span> {item.day}</p>
										</div>
								)
							}.bind(this))}  
							
						</div>
						
								<EmployeeRow employeeWeeklySchedule={this.state.employeeWeeklySchedule} />
							
					</div>
				</div>
						
				</div>	

					<ReactCSSTransitionGroup transitionName="employeeBox" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
						{(this.state.showForm) 
							? <EmployeeInfoForm
								info={this.state.employeeInfo} key={this.state.employeeInfo.uniqueId} /> 
							: ""}	
					</ReactCSSTransitionGroup>

					<ReactCSSTransitionGroup transitionName="employeeBox" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
						{(this.state.showConfirm) 
							? <Confirm
								key={v4()} clearSchedule={this.clearSchedule}/> 
							: ""}	
					</ReactCSSTransitionGroup>

			</div>
		)
	}
})
import React from 'react';
import store from 'store';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import CallIn from 'ui/callIn';
import SidePanel from 'ui/sidePanel';
import {Link, browserHistory} from 'react-router';
import { getEmployeeSchedule, calendar } from 'api/data';


require("assets/styles/calendar.scss");
var image = require("assets/images/ariawhite.png");
require('font-awesome-webpack');
var $ = require('jquery');


var month = new Date().getMonth(), 
	year = new Date().getFullYear(), 
	days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], 
	months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], 
	daysInMonths = [31, (((year%4==0)&&(year%100!=0))||(year%400==0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], 
	date = new Date().getDate(), 
	day = days[new Date().getDay()]

export default React.createClass({
	getInitialState: function(){
		return ({
			showCallIn: false,
			employeeMonthlySchedule: [],
			month: months[new Date().getMonth()],
			year: year,
			calendarDays: [],
			selectedDay: date,
			day: day,
			fullDate: months[new Date().getMonth()] + " " + date + ", " + year,
			jsDateToCheck: "",
			collection: [],
			working_today: "",
			working: false,
			working_bool: true,
			starting_time: "",
			request: ""
		})
	},
	componentWillMount: function(){
		this.unsubscribe = store.subscribe(function(){
			var currentStore = store.getState();
			this.setState({
				showCallIn: currentStore.showReducer.showCallIn,
				employeeMonthlySchedule: currentStore.employeeReducer.employeeMonthlySchedule,
				month: currentStore.calendarReducer.month,
				year: currentStore.calendarReducer.year,
				calendarDays: currentStore.calendarReducer.calendarDays,
				collection: currentStore.calendarReducer.collection,
				working_today: currentStore.calendarReducer.working_today
			})
		}.bind(this));
		calendar(months[month], year, month+1, true);

	},
	componentDidMount: function(){
		console.log('Working_Today', this.state.working_today);
		
	},
	callIn: function(e){
		e.preventDefault();
		console.log('Js Date', this.state.jsDateToCheck);
		// console.log('Curr Date', new Date(year, month, date));
		var jsDate = this.state.jsDateToCheck;
		var dateToCheck = new Date(jsDate[0], jsDate[1], jsDate[2]);
		var day_off_text = "Day Off";
		var seize_the_text = "It's your day off. Seize the day!";
		var in_the_past_text = "Date must be in the future.";
		if(dateToCheck < new Date()){
			console.log('In the past')
			console.log(dateToCheck)
			return document.querySelector('.day_status').innerHTML = in_the_past_text
		} else {
			this.setState({
				request: val
			})
		}
		var day_status = document.querySelector('.day_status').innerHTML;
		var val = e.target.innerHTML;

		if(day_status === day_off_text || day_status === seize_the_text) {
			document.querySelector('.day_status').innerHTML = "It's your day off. Seize the day!"
			console.log('hittin');
		} else {
			this.setState({
				request: val
			})
		
			store.dispatch({
				type: 'CHANGE_SHOWCALLIN',
				showCallIn: true
		})}
	},
	backToHome: function(){
		browserHistory.push('/home');
	},
	createCalendar: function(){
		setTimeout(function(){
			var x = $('.month-year').text().trim().split(" ");
			var shootmonth = months.indexOf(x[0]) + 1;
			calendar(x[0], x[1], shootmonth, true);
		}, 50);
		// this.setState({
		// 	working: false,
		// 	starting_time: "",
		// 	working_today: {}
		// })
	},
	nextMonth: function(e){
		e.preventDefault();
		$('.box').removeClass('highlight');
		if(e.target.id === "previous") {
			
			store.dispatch({
				type: 'GET_CALENDAR',
				month: ((this.state.month === 0) ? this.state.month + 11 : this.state.month - 1),
				year: ((this.state.month === 0) ? this.state.year - 1 : this.state.year)
			})
			this.createCalendar()
			
		} else {
			store.dispatch({
				type: 'GET_CALENDAR',
				year: ((this.state.month === 11) ? this.state.year + 1 : this.state.year),
				month: ((this.state.month === 11) ? this.state.month = 0 : this.state.month + 1)
			})
			this.createCalendar();
		}	
	},
	selectDay: function(item, index, e){
		e.preventDefault();
		this.setState({
			working_bool: false
		})
		var y = months.indexOf(item.month);
		var z = new Date(item.year, y, item.day).getDay();
		
		$('.box').removeClass('highlight');
		var great = $('#box' + index).addClass('highlight');
		console.log(great);
		// console.log('Day selected', item)
		this.setState({
			selectedDay: item.day,
			day: days[z],
			fullDate: item.month + " " + item.day + ", " + item.year,
			starting_time: item.starting_time,
			working: (!(item.starting_time === "") ? true : false),
			jsDateToCheck: [item.year, y, item.day]
		})

	},
	logout: function(){
		browserHistory.push('/');
	},
	componentWillUnmount: function () {
		this.unsubscribe();
	},
	render: function(){
		return (
			<div className="scheduleBg">
				
				
				<div className="headerBar">
					<div>
					 	<span className="roster"><span className="letter">R</span>oster</span><span className="barn"><span className="">B</span>arn</span>
					</div>
					<div id="imageContainer">
						<img src={image}/>
					</div>
					<div className="employeeLogout" onClick={this.logout}>
						Logout
					</div>
				</div>
				<div className="calenderFlex">

					<div className="cal">
						<div className="header">
							<div className="previous" id="previous" onClick={this.nextMonth}>&lang;</div>
							<div className="month-year">{months[this.state.month]} {this.state.year}</div>
							<div className="next" id="next" onClick={this.nextMonth}>&rang;</div>
						</div>
						<div className="days">
							<div>SUN</div>
							<div>MON</div>
							<div>TUE</div>
							<div>WED</div>
							<div>THUR</div>
							<div>FRI</div>
							<div>SAT</div>
						</div>
						<div className="date">
							{this.state.collection.map(function(item, i){
								return (
									<div key ={i} className={"box " + item.currentClass} id={"box" + i} onClick={this.selectDay.bind(this, item, i)}>
										<p>{item.day}</p>
										<p id="startTime">{item.starting_time}</p>
									</div>
								)
							}.bind(this))} 	
								
						</div>
							
					</div>

					<div className="dayOf">
						<div className="headerDay">{(this.state.selectedDay === new Date().getDate() ? "Today" : "Selected Day")}</div>
						<div className="currentDay">
							<p>{this.state.selectedDay}</p>
							<p>{this.state.day}</p>
							<p>{this.state.fullDate}</p>
						</div>
						<div className="divider"></div>
						<div className="status">
							{((!(this.state.working_today === "")) && (this.state.working_bool)) ? <p className="day_status">Working today at <span>{this.state.working_today}</span>.</p> : ((this.state.working) && (this.state.starting_time)) ? <p className="day_status">Scheduled on {this.state.fullDate} at {this.state.starting_time}.</p> : <p className="day_status">Day Off</p>}
						</div>
						<div className="divider"></div>
						<div className="dayOptions">
							<a href="" onClick={this.callIn} id="call_in">Call In</a>
							<a href="" onClick={this.callIn} id="early_out">Early Out</a>
							<a href="" onClick={this.callIn} id="switch_shift">Shift Switch</a>
							<a href="" onClick={this.callIn} id="shift_giveaway">Shift Giveaway</a>
						</div>
					</div>
				</div>
						<ReactCSSTransitionGroup transitionName="employeeBox" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
							{this.state.showCallIn ? <CallIn fullDate={this.state.fullDate} request={this.state.request} key={this.state.fullDate}/> : ""}
						</ReactCSSTransitionGroup>
				
			</div>
		)
	}
})
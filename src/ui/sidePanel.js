import React from 'react';
import store from 'store';
import { Link, browserHistory } from 'react-router';
import { calendar, publish, getEmployeeSchedule, getWeekByWeek } from 'api/data';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


require("assets/styles/sidePanel.scss");
require('font-awesome-webpack');
var $ = require('jquery');

// var image = require("assets/images/ariawhite.png"); 

var month = new Date().getMonth(), 
	year = new Date().getFullYear(), 
	months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] 


export default React.createClass({
	getInitialState: function(){
		return ({
			collapse: "",
			openClose: "fa fa-minus-circle fa-2x",
			flexbox_size: "",
			collection: [],
			month: months[new Date().getMonth()],
			year: year,
			publishButton: "noChanges"
		})
	},
	componentWillMount: function(){
		this.unsubscribe = store.subscribe(function(){
			var currentStore = store.getState();
			this.setState({
				weeklyCalendar: currentStore.calendarReducer.weeklyCalendar,
				flexbox_size: currentStore.calendarReducer.flexbox_size,
				collection: currentStore.calendarReducer.collection,
				month: currentStore.calendarReducer.month,
				year: currentStore.calendarReducer.year,
				publishButton: currentStore.cssReducer.publishButton
			})
		}.bind(this));
	},
	componentDidMount: function(){
		calendar(months[month], year, month+1, false);
	},
	createCalendar: function(){
		setTimeout(function(){
			var x = $('.month-year').text().trim().split(" ");
			var shootmonth = months.indexOf(x[0]) + 1;
			calendar(x[0], x[1], shootmonth, false);
		}, 50);
	},
	nextMonth: function(e){
		e.preventDefault();
		// $('.box').removeClass('highlight');
		// console.log('Hit');
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
	collapseSidePanel: function(){
		this.unsubscribe = store.subscribe(function(){
			var currentStore = store.getState();
			this.setState({
				collapse: ((this.state.collapse === "") ? "collapse" : ""),
				openClose: ((this.state.openClose === "fa fa-plus-circle fa-2x") ? "fa fa-minus-circle fa-2x" : "fa fa-plus-circle fa-2x"),
				flexbox_size: currentStore.calendarReducer.flexbox_size
			})
		}.bind(this))
		
		store.dispatch({
			type: 'ALTER_FLEXBOXSIZE',
			flexbox_size: ((this.state.flexbox_size === "") ? "changeFlexBoxSize" : "")
		})
	},
	publish: function(){
		if(this.state.publishButton  === "publish"){
			publish({date: this.props.dateString});
			store.dispatch({
				type: 'CHANGE_PUBLISHBUTTON',
				publishButton: "noChanges"
			})
		}
	},
	scheduleJump: function(item, e){
		e.preventDefault();
		console.log(item);
		getEmployeeSchedule(item.year, (item.javascriptMonthNum + 1), item.day);
		getWeekByWeek(item.year, item.javascriptMonthNum, item.day);
	},
	shiftFilter: function(e){
		var val = e.target.id[1];
		var type = e.target.innerHTML;
		console.log(type);
		this.props.filterByShift(val, type);
	},
	changeColor: function(e){
		var val = e.target.id;
		console.log(val);
		this.props.setColor(val);
	},
	render: function(){
		return (
			<div className={"sidePortal " + this.state.collapse}>

				{/* <div className="profile"></div>
				<div className="pic"></div> */}

				<div className="sidePortalFlex">
				
				
				<div className="portalOptions">

				{/*	<div className="homeButton">
						<i className="fa fa-home fa-2x" aria-hidden="true" onClick={this.backToHome}></i> 
					</div> */}

					<details>
						<summary className="locations"><i className="fa fa-calendar" aria-hidden="true"></i>Calendar</summary>

						<div className="adminCal">

						<div className="adminCalHeader">
							<div className="previous" id="previous" onClick={this.nextMonth}>&lang;</div>
							<div className="month-year">{months[this.state.month]} {this.state.year}</div>
							<div className="next" id="next" onClick={this.nextMonth}>&rang;</div>
						</div>

						<div className="adminCalDays">
							<div>SUN</div>
							<div>MON</div>
							<div>TUE</div>
							<div>WED</div>
							<div>THUR</div>
							<div>FRI</div>
							<div>SAT</div>
						</div>

						<div className="adminCalDate">
							{this.state.collection.map(function(item, i){
								return (
									<div key ={i} className={"adminCalBox " + item.currentClass} id={"box" + i} onClick={this.scheduleJump.bind(this, item)}>
										<p>{item.day}</p>
									</div>
								)
							}.bind(this))} 	
								
						</div>
							
				</div>
					</details>

					<details>
						<summary className="locations"><i className="fa fa-users" aria-hidden="true"></i>Staff</summary>


					</details>

					<details>
						<summary className="locations"><i className="fa fa-user" aria-hidden="true"></i>Position</summary>
					</details>

					<details>
						<summary className="locations"><i className="fa fa-map-signs" aria-hidden="true"></i>Location</summary>
					</details>

					<details>
						<summary className="locations"><i className="fa fa-envelope-o" aria-hidden="true"></i>Requests</summary>
					</details>

					<details>
						<summary className="locations"><i className="fa fa-tint" aria-hidden="true"></i>Color Code</summary>
							<div className="colorBox">
								<div className="colors" id="station" onClick={this.changeColor}>By Area</div>
								<div className="colors" id="positionClass" onClick={this.changeColor}>By Position</div>
								<div className="colors" id="starting_time" onClick={this.changeColor}>By Start-Time</div>
							</div>
					</details>

					<details>
						<summary className="locations"><i className="fa fa-clock-o" aria-hidden="true"></i>Shifts</summary>
							<div className="shiftBox">
								<div className="shifts" id="a1" onClick={this.shiftFilter}>grave</div>
								<div className="shifts" id="a2" onClick={this.shiftFilter}>day</div>
								<div className="shifts" id="a3" onClick={this.shiftFilter}>swing</div>
								<div className="shifts" id="a" onClick={this.shiftFilter}>all</div>
							</div>
					</details>
				</div>
				
				
				</div>
				
				{/*<div className="collapseButton">
					<i className={this.state.openClose} aria-hidden="true" onClick={this.collapseSidePanel}></i>
				</div>*/}
				<div className={this.state.publishButton} onClick={this.publish}>
					<button>Publish & Notify</button>
				</div> 
			</div>
		)
	}
})
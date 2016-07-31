import api from '../api/api';
import store from '../store';
import { browserHistory } from 'react-router'; 
import Cookie from 'js-cookie';
import { v4 } from 'uuid';

api.new('https://sheltered-springs-57964.herokuapp.com/');
// api.new('http://10.68.0.45:8000/');

export function login(user, pass) {
  return api.login(user, pass);
}

export function logout() {
 return api.logout();
}

export function registerNewEmail(obj){
	console.log('New Email registered');
	return api.post('/profiles/notify/employee/', obj);

}
export function addNewEmployee(obj){
	return api.post('/profiles/employee/', obj);
}

export function updateEmployee(id, obj){
	return api.put('/profiles/employee/update/' + id + "/", obj);

}
export function deleteEmployee(id){
	return api.delete('/profiles/employee/' + id + "/");

}

export function checkAdmin(){
	// console.log("api", api);
	// console.log("check_admin", Cookie.get('token'));
	return api.get('/profiles/check/').then(function(resp){
		// console.log('checkAdmin function', resp.data.type, resp.data.department, resp.data.department_title);
		if(resp.data.type === "manager"){
			localStorage.setItem("departmentId", resp.data.department);
			localStorage.setItem("departmentTitle", resp.data.department_title);
			browserHistory.push('/scheduler')
		} else {
			browserHistory.push('/calendar')
		}
	})
}

export function createEmployeeInfo(employee, type){
	employee.nameString = employee.first_name + " " + employee.last_name
	employee.uniqueId = v4();
	employee.classInfoTime = type;
	
	return employee
}

export function createEmployeeShift(employee, type, currentShift, date){
	var newItem = {
		id: employee.id,
		calendar_date: date,
		uniqueId: v4(),
		starting_time: currentShift.time || '',
		station: currentShift.station || '',
		classInfoTime: type,
		position_title: employee.position_title
	}
	
	return newItem
}

export function getEmployeeSchedule(date, shiftId, departmentId, clearAll){
	var workWeekSchedule = [], employees = [], scheduledEmployees = [], weekdays = [], employeeRow = [];

	var weekShiftParams = {};
	weekShiftParams['date'] = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
	weekShiftParams['department'] = departmentId;
	var shiftQuery = queryStringFromDict(weekShiftParams);

	var employeeParams = {};
	employeeParams['shift_title'] = shiftId;
	employeeParams['department'] = departmentId;
	var employeeQuery = queryStringFromDict(employeeParams);

	return api.get('/schedules/weekshift/' + shiftQuery).then(function(resp){
		workWeekSchedule = ((clearAll) ? [] : resp.data);

		return api.get('/profiles/employee/' + employeeQuery).then(function(resp){
			employees = resp.data;
	
			getWeekByWeek(date, function(weekdays){
					weekdays = weekdays;
					for(var i = 0, n = 0; i < employees.length; i++, n++){
						scheduledEmployees.push(createEmployeeInfo(employees[i], "nameField"))
						for(var j = 0; j < 7; j++){
							var currentShift = checkIfWorking(weekdays[j].calendar_date, employees[i].id);
							scheduledEmployees.push(createEmployeeShift(employees[i], 'timeField', currentShift, weekdays[j].calendar_date));
						}
					}
			})
				
				function checkIfWorking(date, id){
					for(var i = 0; i < workWeekSchedule.length; i++){
						if(workWeekSchedule[i].calendar_date === date && workWeekSchedule[i].employee.id === id) {
							return ((workWeekSchedule[i].starting_time) 
								? {
									time: workWeekSchedule[i].starting_time.slice(0, 5), 
									station: ((workWeekSchedule[i].station) ? workWeekSchedule[i].station.title : "")} 
								: "")
						}
					}
					return ""
				}

				// Split array of objects by employee for flexbox display
				for(let i = 0; i < employees.length; i++){
					employeeRow.push(scheduledEmployees.splice(0, 8));
				}

				store.dispatch({
					type: 'GET_EMPLOYEEWEEKLYSCHEDULE',
					employeeWeeklySchedule: employeeRow
				})
				
		})	

	})
}

export function getWeekByWeek(date, cb){
		var abbreviatedDayString = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];
		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var dayIndex = date.getDay();
		var dumbWay = [-6, 0, -1, -2, -3, -4, -5];
		var smartWay = (dayIndex + 6) % 7;
		var daysToNearestMonday = dumbWay[dayIndex];
		var weekStartDate = date.addDays(daysToNearestMonday);
		var weekDays = [];
		

		for(let i = 0; i < 7; i++){
			weekDays[i] = {
				year: weekStartDate.addDays(i).getFullYear(),
				monthString: months[weekStartDate.addDays(i).getMonth()],
				dayString: abbreviatedDayString[weekStartDate.addDays(i).getDay()],
				javascriptMonthNum: weekStartDate.addDays(i).getMonth(),
				day: weekStartDate.addDays(i).getDate(),
				calendar_date: weekStartDate.addDays(i).getFullYear() + "-" + (weekStartDate.addDays(i).getMonth() + 1) + "-" + weekStartDate.addDays(i).getDate(),
				currentClass: ""
			}
		}

		((cb) ? cb(weekDays) : "");

		((!cb) ? store.dispatch({
			type: 'GET_WEEKLYCALENDAR',
			weeklyCalendar: weekDays
		})
		: "")
		

		// console.log('weeklyCalendar', weekDays);

}

export function getWorkWeekSchedule(month, year){
	return api.get('/schedules/employeemonth/?month=' + month + '&year=' + year).then(function(resp){

		store.dispatch({
			type: 'GET_EMPLOYEEMONTHLYSCHEDULE',
			employeeMonthlySchedule: resp.data
		})
		// console.log('From the call', resp.data);
	})
}

export function publish(obj){
	return api.post('/schedules/shift/publish/', obj);
}

export function setNewSchedule(uniqueId, arr, newScheduleItem) {
	console.log('Set New Schedule ', newScheduleItem);
	var newArr = arr.map(function(indArr){
		return indArr.map(function(item){
			if (item.uniqueId === uniqueId) {
				return newScheduleItem;
				// return new schedule item with date attached
			} else {
				return item;
			}
		});
	});
	// console.log('After function', newArr)
	store.dispatch({
		type: 'GET_EMPLOYEEWEEKLYSCHEDULE',
		employeeWeeklySchedule: newArr
	})
}

export function clearAllSchedule(array){
	return api.post('/schedules/shift/many/', array);
}

export function sendSingleEmployeeShiftObj(obj){
	return api.post('/schedules/shift/many/', obj);
}


Date.prototype.addDays = function(days){
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

Date.prototype.subtractDays = function(days){
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() - days);
    return dat;
}

export function stringDate(date) {
	return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}

export function working_today(scheduleInfo){
	var start_time = ""
	scheduleInfo.forEach(function(item, i){
		if(item.day === new Date().getDate() && item.javascriptMonthNum === new Date().getMonth()){
			start_time = item.starting_time
		}
	})
	return start_time || ""
}

export function calendar(month, year, monthdate, employee){
	// console.log('Init', month, year, monthdate);
	
		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var month = monthdate - 1;
		var preceding_days = new Date(year, month, 1).getDay();
		var	month_count = new Date(year, month+1, 0).getDate();
		var	trailing_days = 42 - month_count - preceding_days;
		var start_day = new Date(year, month, 1).subtractDays(preceding_days);
		var collection = [];

		function collectionDate(date, type) {
			var newItem = {
				calendar_date: stringDate(date),
				currentClass: type,
				day: date.getDate(),
				month: months[date.getMonth()],
				year: date.getFullYear(),
				javascriptMonthNum: date.getMonth()
			};
			return newItem;
		}

		for(var i=0; i < 42; i++) {
			if(i < preceding_days || i >= 42 - trailing_days){
				collection.push(collectionDate(start_day.addDays(i), 'inactiveMonth'));
			}
			else{
				collection.push(collectionDate(start_day.addDays(i), ""));
			}
		}

		// console.log('collection', collection);

		if (employee){

		 return api.get('/schedules/employeemonth/?month=' + monthdate + '&year=' + year).then(function(resp){

		 	var data = resp.data;

			var scheduleInfo = collection.map(function(item, i){
					return ({
						year: item.year,
						month: item.month,
						day: item.day,
						calendar_date: item.calendar_date,
						currentClass: item.currentClass,
						javascriptMonthNum: item.javascriptMonthNum,
						starting_time: checkSchedule(item.calendar_date)
					})
				})

			var working = working_today(scheduleInfo);

				store.dispatch({
					type: 'GET_DATEOBJECTS',
					collection: scheduleInfo,
					working_today: working
				})

				// console.log('scheduleInfo', scheduleInfo);

				console.log("Working Today From Calendar Function:", working);

				function checkSchedule(check){
					var hour_time_check = 0;
					for(var i = 0; i < data.length; i++){
						if(data[i].calendar_date === check) {
							if(data[i].starting_time){
								hour_time_check = parseInt(data[i].starting_time.slice(0, 2));
								if(hour_time_check === 12){
									return data[i].starting_time.slice(0, 5) + "pm";
								} else if(hour_time_check < 12) {
									return data[i].starting_time.slice(0, 5) + "am"
								} else {
									hour_time_check = hour_time_check - 12
									return hour_time_check + ":" + data[i].starting_time.slice(3, 5) + "pm"
								}
							}
							else {
								return ""
							}
						}
					}
				}
		
		})} else { 

			store.dispatch({
				type: 'GET_DATEOBJECTS',
				collection: collection
			})}
}

export function addNewEmployeeUser(username, password, profile_id, cb){

  return api.post('profiles/useremployee/', {username:username, password:password, profile_id:profile_id}).then(function(){
    api.login(username, password).then(function(){
       cb();
    }).catch(function(err){
      console.log(err);
    });
  }).catch(function(err){
    console.log(err);
  });
}

export function queryStringFromDict(dict) {
	// Takes an object of query params and returns a query string.
	var valuesArray = [];
	for(var key in dict) {
		if(dict[key]) {
			valuesArray.push(String(key) + '=' + String(dict[key]))
		}
	}
	if(valuesArray.length > 0){
		return '?' + valuesArray.join('&');
	}
	else{
		return '';
	}
}


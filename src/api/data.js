import api from 'api/api';
import store from 'store';
import { browserHistory } from 'react-router'; 

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
	return api.get('/profiles/check/').then(function(resp){
		console.log('checkAdmin function', resp.data.type, resp.data.department, resp.data.department_title);
		if(resp.data.type === "manager"){
			localStorage.setItem("departmentId", resp.data.department);
			localStorage.setItem("departmentTitle", resp.data.department_title);
			browserHistory.push('/scheduler')
		} else {
			browserHistory.push('/calendar')
		}
	})
}
export function getEmployeeSchedule(year, month, day, shift, department){
	var pythonMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
	var pythonChopDate = new Date(year, month-1, day);
	year = pythonChopDate.getFullYear();
	month = pythonMonth[pythonChopDate.getMonth()];
	day = pythonChopDate.getDate();
	var workWeekSchedule = [];
	var employees = [];
	var pythonBackToJavascriptMonth = month - 1;
	var scheduledEmployees = [];
	var weekdays = [];
	var departmentQuery = "&department=" + department;
	
	return api.get('/schedules/weekshift/?date=' + year + "-" + month + "-" + day + departmentQuery).then(function(resp){
		workWeekSchedule = resp.data;
		console.log('Weekly Schedules from Back End', resp.data);
		var shiftFilter = ((shift) ? '/profiles/employee/' + shift : '/profiles/employee/');

		return api.get(shiftFilter).then(function(resp){
			employees = resp.data;
			// console.log('Employee List', resp.data)
			getWeekByWeek(year, pythonBackToJavascriptMonth, day, function(weekdays){
					weekdays = weekdays;

					for(var i = 0, n = 0; i < employees.length; i++, n++){
						scheduledEmployees.push({
								nameString: employees[i].first_name + " " + employees[i].last_name,
								employee_id: employees[i].employee_id,
								classInfoName: "nameField",
								first_name: employees[i].first_name,
								last_name: employees[i].last_name,
								id: employees[i].id,
								photo_url: employees[i].photo_url,
								availability: employees[i].availability,
								uniqueId: employees[i].id + '-' + employees[i].employee_id,
								phone_number: employees[i].phone_number,
								email: employees[i].email,
								position_title: employees[i].position_title
								
							})
						for(var j = 0; j < 7; j++){
							// console.log(employees[i].employee_id)
							var currentShift = checkIfWorking(weekdays[j].calendar_date, employees[i].id);
							let uniqueId = weekdays[j].calendar_date + '-' + employees[i].id;
							let obj = {
								id: employees[i].id,
								first_name: employees[i].first_name,
								last_name: employees[i].last_name,
								name: employees[i].first_name + " " + employees[i].last_name,
								calendar_date: weekdays[j].calendar_date,
								employee_id: employees[i].employee_id,
								starting_time: currentShift.time || '',
								station: currentShift.station || '',
								uniqueId: uniqueId,
								classInfoTime: "timeField",
								phone_number: employees[i].phone_number,
								email: employees[i].email,
								position_title: employees[i].position_title
							}

							scheduledEmployees.push(obj);
						}
					}
			})
				
				function checkIfWorking(date, id){
					// console.log('In the function', workWeekSchedule);
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


				var newarr = [];
				for(let i = 0; i < employees.length; i++){
					newarr.push(scheduledEmployees.splice(0, 8));
				}

				store.dispatch({
					type: 'GET_EMPLOYEEWEEKLYSCHEDULE',
					employeeWeeklySchedule: newarr
				})


				console.log('employeeWeeklySchedule', newarr);
				// console.log('scheduledEmployees', scheduledEmployees);	
				// console.log('Cb', weekdays);
				// console.log('workWeekSchedule', workWeekSchedule);
				// console.log('employees', employees);

		})	

		
		// console.log('From the call', resp.data);
	})
}

export function getWeekByWeek(year, month, day, cb){
		var abbreviatedDayString = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];
		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var dat = new Date(year, month, day);
		var dayIndex = dat.getDay();
		var weekDays = [];
		var dayIndexArray = [[-6, -5, -4, -3, -2, -1, 0],[0, 1, 2, 3, 4, 5, 6],[-1, 0, 1, 2, 3, 4, 5],[-2, -1, 0, 1, 2, 3, 4],[-3, -2, -1, 0, 1, 2, 3],[-4, -3, -2, -1, 0, 1, 2],[-5, -4, -3, -2, -1, 0, 1]];


		
		for(let i = 0; i < 7; i++){
			let n = dayIndexArray[dayIndex][i]
			var pythonMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
			weekDays[i] = {
				year: dat.addDays(n).getFullYear(),
				monthString: months[dat.addDays(n).getMonth()],
				dayString: abbreviatedDayString[dat.addDays(n).getDay()],
				javascriptMonthNum: dat.addDays(n).getMonth(),
				day: dat.addDays(n).getDate(),
				calendar_date: dat.addDays(n).getFullYear() + "-" + pythonMonth[dat.addDays(n).getMonth()] + "-" + dat.addDays(n).getDate(),
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

export function sendEmployeeShiftObj(obj){
	console.log('Send Employee Shift Obj', obj);
	return api.post('/schedules/shift/many/', obj)
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
	//console.log("profile: ", profile_id);

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


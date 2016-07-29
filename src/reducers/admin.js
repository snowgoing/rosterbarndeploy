const adminInitialState = {
	employeeWeeklySchedule: []
}

export default function(state = adminInitialState, action){

	switch (action.type) {

		case 'GET_EMPLOYEEWEEKLYSCHEDULE':
			return {
				employeeWeeklySchedule: action.employeeWeeklySchedule
			}

		case 'USER_LOGOUT':
		console.log('Admin reducer', adminInitialState);
		return adminInitialState
	default:
		return state;

	}
}


const employeeInitialState = {
	employeeMonthlySchedule: [],
	employeeInfo: {}
}

export default function(state = employeeInitialState, action){

	switch (action.type) {

		case 'GET_EMPLOYEEMONTHLYSCHEDULE':
			return {
				employeeMonthlySchedule: action.employeeMonthlySchedule,
				employeeInfo: state.employeeInfo
			}

		case 'THROW_EMPLOYEEINFO':
		// console.log(action.employeeInfo);
			return {
				employeeMonthlySchedule: state.employeeMonthlySchedule,
				employeeInfo: action.employeeInfo

			}
		case 'USER_LOGOUTSS':
			return employeeInitialState;

	default:
		return state;

	}
}


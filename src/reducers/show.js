const showInitialState = {
	showCallIn: false,
	showForm: false,
	showConfirm: false

}

export default function(state = showInitialState, action){

	switch (action.type) {

		case 'CHANGE_SHOWCALLIN':
			return {
				showCallIn: action.showCallIn,
				showForm: state.showForm,
				showConfirm: state.showConfirm
			}

		case 'CHANGE_SHOWFORM':
			return {
				showCallIn: state.showCallIn,
				showForm: action.showForm,
				showConfirm: state.showConfirm
			}

		case 'CHANGE_SHOWCONFIRM':
			return {
				showCallIn: state.showCallIn,
				showForm: state.showForm,
				showConfirm: action.showConfirm
			}

	default:
		return state;
	
	}
}
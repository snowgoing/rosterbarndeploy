import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

// Add middleware to createStore
var createStoreWithMiddleware = applyMiddleware(thunk)(createStore)

// App Reducers
import ShowReducer from './reducers/show';


// Combine Reducers
var reducers = combineReducers({
	showReducer: ShowReducer
  // more...
});

const rootReducer = (state, action) => {
	console.log('rootReducer hit');
  if (action.type === 'USER_LOGOUT') {
    state = undefined
  }

  return reducers(state, action)
}

// Create Store
var store = createStoreWithMiddleware(reducers);

export default store;

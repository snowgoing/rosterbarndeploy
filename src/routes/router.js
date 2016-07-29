import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import store from '../store';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// layouts
import App from '../layouts/app';

// import Homepage from 'ui/home';
import Home from '../components/app';



export default (
	<MuiThemeProvider>
	 	<Provider store={store}>
		    <Router history={browserHistory}>
		      <Route component={App}>
		      	<Route path='/' component={Home} />
		      </Route>
		    </Router>
	    </Provider>
	    </MuiThemeProvider>
)

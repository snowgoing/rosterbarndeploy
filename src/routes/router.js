import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import store from 'store';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


// layouts
import App from 'layouts/app';

// import Homepage from 'ui/home';
import Home from 'ui/home';
import Calendar from 'ui/calendar';
import Scheduler from 'ui/scheduler';
import LandingPage from 'ui/landingPage';
import employeeSignUp from 'ui/employeeSignUp';
import Info from 'ui/employeeInfoForm';



export default (
  <MuiThemeProvider>
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route component={App}>
      	<Route path='/landingPage' component={LandingPage} />
        <Route path='/info' component={Info} />
      	<Route path='/' component={Home} />
      	<Route path='/calendar' component={Calendar} />
      	<Route path='/scheduler' component={Scheduler} />
        <Route path='/employee/*' component={employeeSignUp} />	
      </Route>
    </Router>
  </Provider>
  </MuiThemeProvider>
)

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import store from '../store';


// layouts
import App from '../components/app';

// import Homepage from 'ui/home';




export default (
 
    <Router history={browserHistory}>
      <Route component={App}>
      	<Route path='/' component={App} />
      </Route>
    </Router>

)

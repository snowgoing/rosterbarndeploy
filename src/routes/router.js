import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import store from '../store';


// layouts
import App from '../layouts/app';

// import Homepage from 'ui/home';
import Home from '../components/app';



export default (
 
    <Router history={browserHistory}>
      <Route component={App}>
      	<Route path='/' component={Home} />
      </Route>
    </Router>

)

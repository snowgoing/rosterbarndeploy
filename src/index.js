import React from 'react'
import { render } from 'react-dom'
import App from './components/app'
// import './styles/app.scss'
import Router from './routes/router';
import './styles/home.scss'
import './styles/calendar.scss'
import './styles/callin.scss'
import './styles/confirm.scss'
import './styles/employeeInfoForm.scss'
import './styles/employeeSignUp.scss'
import './styles/employeeToSchedule.scss'
import './styles/layout.scss'
import './styles/scheduler.scss'
import './styles/sidePanel.scss'



render(Router, document.getElementById('main'))

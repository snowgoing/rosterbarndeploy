import React from 'react'
import { render } from 'react-dom'
import App from './components/app'
import './styles/app.scss'
import Router from './routes/router';

render(Router, document.getElementById('main'))

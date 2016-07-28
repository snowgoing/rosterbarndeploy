import React from 'react';
import store from 'store';
import { login, checkAdmin, addNewEmployeeUser } from 'api/data';
import { Link, browserHistory, Router, Route } from 'react-router';

require("assets/styles/home.scss");
require("assets/styles/employeeSignUp.scss");

var image = require("assets/images/ariawhite.png");



export default React.createClass({
	

	getInitialState: function(){
		
		console.log(this.props.params.splat);

		return {
			username: "",
			password: "",
			passwordMatch: "",
			error: false,
		}
	},	
	handleChange: function(e){
		if (e.target.id === 'username') {
			this.setState({
				username: e.target.value,
				password: this.state.password,
				passwordMatch: this.state.passwordMatch
			})
		} else if(e.target.id === 'password'){
			this.setState({
				username: this.state.username,
				password: e.target.value,
				passwordMatch: this.state.passwordMatch
			})
		} else if(e.target.id === 'passwordMatch') {
			this.setState({
				username: this.state.username,
				password: this.state.password,
				passwordMatch: e.target.value
			})
		}
		
	},
	handleSubmit: function(e){

		e.preventDefault();
		//browserHistory.push('/calendar');
		var that = this;

		if(this.state.password === this.state.passwordMatch) {
			addNewEmployeeUser(this.state.username, this.state.password, that.props.params.splat, function(){
				browserHistory.push('/calendar');
			}.bind(this)).catch(function(err){

		}.bind(this));
		} else {
			this.setState({
				error: true,
				username: "",
				password: "", 
				passwordMatch: ""
			});
		}
	},
	render: function(){
		var path = this.getPath;
		console.log(this.state)
		return (
			<div id="homepage">
				<div id="imageContainer" className="homePageLogo">
					<img src={image}/>
				</div>

				<div id="divLine"></div>
				<div id="login"></div>

				<div id="form">

					<form action="" method="post" onSubmit={this.handleSubmit}>
						<div id="schedule">
						<div>
							<span id="createButton">New employee sign up</span>
						</div>
					<div className="rosterLogo">
					 	<span className="roster"><span className="letter">R</span>oster</span><span className="barn"><span className="">B</span>arn</span>
					</div>
					
						</div>
						<div className="centerLogin">
						<input type="text" placeholder="Username" onChange={this.handleChange} value={this.state.username} id="username" name="username" />
						<input type="password" placeholder="Password" onChange={this.handleChange} value={this.state.password} id="password" name="password" />
						<input type="password" placeholder="Confirm Password" onChange={this.handleChange} value={this.state.passwordMatch} id="passwordMatch" />
						<button type="submit">Create Account</button>
						
						</div>
					</form>

					{this.state.error ? <div className='error'>Passwords do not match</div> : ''}

				</div>
			</div>
		)
	}
})
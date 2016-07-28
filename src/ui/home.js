import React from 'react';
import store from 'store';
import { login, checkAdmin } from 'api/data';
import { Link, browserHistory } from 'react-router';

require("assets/styles/home.scss");
var image = require("assets/images/ariawhite.png");

export default React.createClass({
	getInitialState: function(){
		return {
			username: "",
			password: "",
			error: false
		}
	},
	handleChange: function(e){
		if (e.target.type === 'text') {
			this.setState({
				username: e.target.value,
				password: this.state.password
			})
		} else {
			this.setState({
				username: this.state.username,
				password: e.target.value
			})
		}
	},
	handleSubmit: function(e){
		e.preventDefault();
		console.log(this.state.username, this.state.password);
		localStorage.clear();
		login(this.state.username, this.state.password).then(function(resp){
			console.log('handle then');
			localStorage.clear();
			checkAdmin();
		}.bind(this)).catch(function(err){
			console.log('handle catch');
			this.setState({
				error: true,
				username: "",
				password: ""
			});
		}.bind(this));

	},
	render: function(){
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
					<div className="rosterLogo">
					 	<span className="roster"><span className="letter">R</span>oster</span><span className="barn"><span className="">B</span>arn</span>
					</div>
						</div>
						<div className="centerLogin">
						<input type="text" placeholder="Username" onChange={this.handleChange} value={this.state.username} name="username" />
						<input type="password" placeholder="Password" onChange={this.handleChange} value={this.state.password} name="password" />
						<button type="submit">Log In</button>
						<div className="rememberMeBox"><input type="checkbox" /> <span  id="rememberMe">Remember me</span></div>
						</div>
					</form>

					{this.state.error ? <div className='error'>Password and Username do not match</div> : ''}

				</div>
			</div>
		)
	}
})
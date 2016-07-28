import React from 'react';
import { browserHistory } from 'react-router';

require('assets/styles/landingPage.scss');

export default React.createClass({
	login: function(e){
		e.preventDefault();
		browserHistory.push('/home');
	},
	render: function(){
		return (
			<div className="landingPageContainer">
				<div className="adminHeader">
					<div>
					 <span className="roster"><span className="letter">R</span>oster</span><span className="barn"><span className="">B</span>arn</span>
					</div>
					<div className="landingPageHeaderOptions">
						<div className="logout" onClick={this.login} ><i className="fa fa-sign-in" aria-hidden="true"></i>Login</div>
					</div>
				</div> 
				<div className="workImageContainer">
					
				</div>
			</div>
		)
	}
})
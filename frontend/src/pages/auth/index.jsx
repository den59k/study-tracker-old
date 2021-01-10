import React from 'react'

import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import LoginPage from './login'
import RegisterPage from './register'
import ConfirmPage from './confirm'

export default function AuthPage() {

	return (
		<Router>
			<Switch>
				<Route exact path="/" component={LoginPage}/>
				<Route path="/register" component={RegisterPage}/>
				<Route path="/confirm/:token" component={ConfirmPage}/>
				<Redirect from="/" to="/"/>
			</Switch>
		</Router>
	);
}

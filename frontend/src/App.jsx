import React from 'react'
import useSWR from 'swr'

import { BrowserRouter as Router } from 'react-router-dom'
import MainPage from 'pages/main'
import StudentPage from 'pages/student-page'
import AuthPage from 'pages/auth'


export default function App() {
	
	const { data } = useSWR('/api')
	
	if(!data) return <div></div>
	
	if(data.error)
		return <AuthPage/>

	if(data.role === 'teacher')
		return <MainPage user={data}/>
	
	return <StudentPage user={data}/>

}

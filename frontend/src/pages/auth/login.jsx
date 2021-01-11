import React from 'react'
import { useForm, Input, Segment } from 'controls';
import { Link } from 'react-router-dom'
import { REST } from 'libs/fetch'
import { mutate } from 'swr';

export default function LoginPage() {

	const form = useForm();

	const onSubmit = async (e) => {
		e.preventDefault()
		const values = form.values.toObject()
		if(!values.email || !values.password) return

		const response = await REST('/api/login', values, 'POST')

		if(response.error) return form.setErrors(response.error)
		mutate('/api')
	}

	return (
		<div className="flex-center">
			<h1>StudyTracker</h1>
			<h2 className="text-center">Войдите в ваш аккаунт, чтобы<br/>получить доступ к учебной работе</h2>
			<form className="form thin text-center" style={{marginTop: "15px"}} onSubmit={onSubmit}>
				<Input name="email" form={form} className="filled"  placeholder="Email"/>
				<Input name="password" type="password"  form={form} className="filled" placeholder="Пароль"/>
				<button className="button-stroked">Войти</button>
				
				<div className="h-line"></div>
				<div className="small gray">У вас еще нет аккаунта?</div>
				<Link to="/register" className="button" style={{padding: 0, marginTop: '0.7em'}}>Создайте аккаунт прямо сейчас</Link>
			</form>
		</div>
	);
}

import React from 'react'
import { useForm, Input, Segment } from 'controls';
import { Link, useParams } from 'react-router-dom'
import useSWR from 'swr'
import { GET, REST } from 'libs/fetch'

export default function LoginPage() {

	const form = useForm();

	const { token } = useParams()
	const { data } = useSWR('/api/confirm/'+token, GET)

	console.log(data)

	if(!data)
		return (<div></div>)

	if(data.error && data.error === 'wrong token')
		return (
			<div className="flex-center">
				<h1>StudyTracker</h1>
				<h2>Ваша ссылка не действительна</h2>
			</div>
		)

	const onSubmit = async (e) => {
		e.preventDefault()
		if(!form.get('password') || form.get('password').length < 6)
			return form.setErrors({ 'password': 'Пароль слишком короткий' })
		if(form.get('password') !== form.get('repeat-password'))
			return form.setErrors({ 'repeat-password': 'Пароли не совпадают' })
		
		const resp = await REST('/api/confirm/'+token, form.values.toObject(), 'POST')
		console.log(resp)
	}

	return (
		<div className="flex-center">
			<h1>StudyTracker</h1>
			<h2 className="text-center">Теперь придумайте себе пароль, {data.name}</h2>
			<form className="form thin text-center" style={{marginTop: "15px"}} onSubmit={onSubmit}>
				<Input name="password" type="password"  form={form} className="filled" placeholder="Пароль"/>
				<Input name="repeat-password" type="password"  form={form} className="filled" placeholder="Повторите пароль"/>
				<button className="button-stroked">Создать аккаунт</button>
			</form>
		</div>
	);
}

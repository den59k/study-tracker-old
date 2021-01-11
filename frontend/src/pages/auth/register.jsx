import React, { useState } from 'react'
import { useForm, Input, Segment } from 'controls';
import { REST } from 'libs/fetch'

import { Link } from 'react-router-dom'

const roles = {
	student: "Студент",
	teacher: "Преподаватель"
}

export default function RegisterPage() {

	const [ success, setSuccess ] = useState(false)
	const form = useForm({role: 'student'});

	const onSubmit = async (e) => {
		e.preventDefault()
		const values = form.values.toObject()
		const resp = await REST('/api/register',values , 'POST')
		console.log(resp)
		if(!resp.error)
			setSuccess(values)
	}

	if(success)
		return (
			<div className="flex-center">
				<h1>StudyTracker</h1>
				<h2>Письмо с подверждением отправлено на почту {success.email}</h2>
			</div>
		)

	
	return (
		<div className="flex-center">
			<h1>StudyTracker</h1>
			<form className="form text-center label-min" onSubmit={onSubmit}>
				<h2>Получите доступ к работе,<br/> создав свой аккаунт прямо сейчас</h2>
				<Input name="email" form={form} label="Email" placeholder="Ваш email"/>
				<Input name="name"  label="Имя"  form={form} placeholder="Ваше имя"/>
				<Input name="surname" label="Фамилия"  form={form} placeholder="Ваша фамилия"/>
				<Segment name="role" options={roles} form={form}/>
				<button className="button-stroked">Продолжить</button>

				<div className="h-line"></div>
				<div className="small gray">Аккаунт уже зарегистрирован?</div>
				<Link to="/" className="button" style={{padding: 0, marginTop: '0.7em'}}>Войдите в аккаунт</Link>
			</form>
		</div>
	);
}

import React, { useEffect } from 'react'
import { getControl, useForm } from 'controls'

import { modal, ModalBase } from './index'



export function ModalForm ({title, controls, className, onSubmit, defaultValues, children }){

	const onChange = (obj) => {
		for(let key in obj)
			if(controls[key].onChange)
				controls[key].onChange(obj[key], form)
	}

	const form = useForm(defaultValues || {}, onChange)

	const _onSubmit = () => {
		if(!onSubmit) return

		const values = {}

		form.values.forEach((value, key) => {
			if(!controls[key]) return
			if(controls[key].checkNull && !value) return
			if(controls[key].notSend) return

			values[key] = value
		})

		onSubmit(values, form)
	}
	
	return (
		<ModalBase title={title} className={className} >
			<div className="content">
			{Object.keys(controls).map((key) => (
				<div key={key} className="control-container">
					{getControl(key, controls[key], form)}
				</div>
			))}
			</div>
			<div className="buttons">
				<button className="button" onClick={() => modal.close()}>Отмена</button>
				<button className="button-filled" onClick={_onSubmit}>
					Сохранить
				</button>
			</div>
			{ children }
		</ModalBase>
	)
}


export function openModal(title, controls, onSubmit, defaultValues){

	modal.open(<ModalForm title={title} controls={controls} onSubmit={onSubmit} defaultValues={defaultValues}/>)
}

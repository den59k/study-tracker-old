import React from 'react'
import { getControl, useForm } from 'controls'

import { modal, ModalBase } from './index'


export function ModalForm ({title, controls, className, onSubmit, defaultValues }){

	const form = useForm(defaultValues || {})

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
				<button className="button-filled" onClick={onSubmit? () => onSubmit(form.values.toObject(), form): null}>Сохранить</button>
			</div>
		</ModalBase>
	)
}


export function openModal(title, controls, onSubmit, defaultValues){

	modal.open(<ModalForm title={title} controls={controls} onSubmit={onSubmit} defaultValues={defaultValues}/>)
}

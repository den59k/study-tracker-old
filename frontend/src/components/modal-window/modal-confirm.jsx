import React from 'react'
import cn from 'classnames'

import { modal, ModalBase } from './index'

export function ModalConfirm({title, text, action, onSubmit, className}){

	return (
		<ModalBase title={title} className="confirm">
			<div className="content">
				{text}
			</div>
			<div className="buttons">
				<button className="button" onClick={() => modal.close()}>Отмена</button>
				<button className={cn("button-filled")} onClick={() => onSubmit()}>{action || "Удалить"}</button>
			</div>
		</ModalBase>
	)
}

export function openModalConfirm(title, text, onSubmit){
	modal.open(<ModalConfirm title={title} text={text} onSubmit={onSubmit} className="confirm"/>)
}
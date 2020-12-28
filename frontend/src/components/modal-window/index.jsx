import React, { useState, useEffect } from 'react'
import cn from 'classnames'

import { IoIosClose } from 'react-icons/io'
import { ModalForm, openModal } from './modal-form'
import { ModalConfirm, openModalConfirm } from './modal-confirm'
import { ModalMedia, openModalMedia } from './modal-media' 

export { ModalForm, openModal, ModalConfirm, openModalConfirm, ModalMedia, openModalMedia }

export const modal = {
	open: () => console.log("null action openModal"),
	close: () => console.log("null action closeModal"),
	scrollTo: () => console.log("null action scroll"),
	alert: () => console.log("null action alert"),
	opened: false
}

export function closeModal(){
	modal.close()
}

export function ModalBase (props){

	useEffect(() => {
		const keyDown = (e) => {
			if(e.code === 'Escape')
				modal.close()
		}

		document.addEventListener('keydown', keyDown)

		return () => document.removeEventListener('keydown', keyDown)
	}, [])

	return (
		<div className={cn("modal", props.className)}>
			<div className="header">
				<h3>{props.title}</h3>
				<button className={"closeButton"} onClick={() => modal.close()}> <IoIosClose/> </button>
			</div>
			{props.children}
		</div>
	)
}

export function ModalWrapper (props){
	
	const [ modalWindow, setModalWindow ] = useState(null);
	const [ scroll, setScroll ] = useState(null);

	modal.open = (_modal, _onClose=null) => {
		modal.opened = true;
		setScroll({left: window.pageXOffset, top: window.pageYOffset, offset: window.innerWidth-document.body.clientWidth});
		setModalWindow(_modal);
		window.requestAnimationFrame(() => window.scroll(0, 0));
		modal.onClose = _onClose;
	}

	modal.close = () => {
		modal.opened = false;
		setModalWindow(null);
		window.requestAnimationFrame(() => window.scroll(scroll.left, scroll.top));
		if(modal.onClose)
			modal.onClose();
	}

	const onClick = (e) => {					
		const target = e.currentTarget;
		if(target === e.target){
			document.addEventListener("mouseup", (e2) => {		//Ну а вот это неплохой код для модалки
				if(target === e2.target)
					modal.close();
			}, { once: true });
		}		
	}

	return (
		<>
			<div 
				className={cn({[props.className]: true, "modal-fixed": modalWindow !== null})} 
				style={scroll?{...props.style, top: -scroll.top+'px', left: -scroll.left+'px', right: scroll.offset+'px'}: props.style}
			>
				{props.children}
			</div>
			{modalWindow !== null && (
				<div className="modal-black" onMouseDown={onClick}>
					{modalWindow}
				</div>
			)}
		</>
	)
}

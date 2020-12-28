import React, { useRef, useState } from 'react'
import cn from 'classnames'


export default function Image ({className, form, label, name}){

	const fileRef = useRef()

	const onFileChange = (e) => {
		const file = e.target.files[0]
		if(!file) return
		e.target.value = ""

		const reader = new FileReader();				//Мы еще должны превратить наше изображение в массив и сразу отправить на сервер
		reader.onload = async () => {
			const array = reader.result;

			const headers = { 'Content-Type': file.type };

			const json = await fetch('/api/images', { method: 'POST', headers, body: array } )
			const resp = await json.json()

			if(resp.error) return

			form.onChange({[name]: resp})
		}

		reader.readAsArrayBuffer(file)
	}

	return (
		<div className={cn(className, "image-control")}>
			{label && (<label>{label}</label>)}
			<input ref={fileRef} onChange={onFileChange} type="file" style={{display: "none"}}/>
			{!form.get(name)?(
				<button className="button-filled" onClick={() => fileRef.current.click()}>Загрузить фото...</button>
			):(
				<div className="image-container">
					<div className="buttons">
						<button className="button-filled" onClick={() => fileRef.current.click()}>Обновить фото...</button>
						<button className="button-filled red" onClick={() => fileRef.current.click()}>Удалить фото</button>
					</div>
					<img src={form.get(name).src} alt="Изображение"/>
				</div>
			)}
			
		</div>
	)
}
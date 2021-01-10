import React, { useRef, useState } from 'react'
import cn from 'classnames'

import { IoMdCloudUpload } from 'react-icons/io'

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

			const json = await fetch('/api/upload', { method: 'POST', headers, body: array } )
			const resp = await json.json()

			if(resp.error) return

			form.onChange({[name]: resp.src})
		}

		reader.readAsArrayBuffer(file)
	}


	return (
		<div className={cn(className, "image-control")}>
			{label && (<label>{label}</label>)}
			<input ref={fileRef} onChange={onFileChange} type="file" style={{display: "none"}}/>

			<button 
				className={cn("image-button", form.get(name) && 'uploaded')} 
				onClick={() => fileRef.current.click()} 
				style={form.get(name)?{backgroundImage: `url(${form.get(name)})`}: {}}
			>
				<IoMdCloudUpload/>
				<span>Загрузить изображение</span>
			</button>

		</div>
	)
}
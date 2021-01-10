import React, { useRef, useState } from 'react'
import cn from 'classnames'

import { IoMdCloudUpload } from 'react-icons/io'
import { sendFile } from 'libs/upload'

export default function Image ({className, form, label, name}){

	const fileRef = useRef()

	const onFileChange = async  (e) => {
		const file = e.target.files[0]
		if(!file) return
		e.target.value = ""

		const { src } = await sendFile(file, '/api/upload')
		form.onChange({[name]: src})
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
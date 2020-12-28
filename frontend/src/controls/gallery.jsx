import React, { useRef, useState } from 'react'
import cn from 'classnames'
import { Set } from 'immutable'

import { IoIosAdd, IoIosCheckmark, IoMdTrash } from 'react-icons/io'
import { num } from 'libs/rus'


export default function Gallery ({className, form, label, name}){

	const [ selection, setSelection ] = useState(new Set())
	const fileRef = useRef()

	const values = form.get(name) || []

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

			form.onChange({[name]: [...values, resp]})
		}

		reader.readAsArrayBuffer(file)

	}

	const select = (index) => {
		if(selection.has(index))
			setSelection(selection.delete(index))
		else
			setSelection(selection.add(index))
	}

	const deleteSelected = () => {
		form.onChange({[name]: values.filter((_item, index) => !selection.has(index)) })
		setSelection(selection.clear())
	}

	return (
		<div className={cn("gallery-control", className, form.errors.get(name) && "errored")}>
			<div className="gallery-header">
				<h4>{label}</h4>
				{selection.size === 0?(
					<button className={cn("button-filled")} onClick={() => fileRef.current.click()}><IoIosAdd/>Добавить фото</button>
				):(
					<button className={cn("button-filled red")} onClick={deleteSelected}>
						<IoMdTrash/>Удалить {num(selection.size, "элемент", "элемента", "элементов")}
					</button>
				)}
	
			</div>
			<input type="file" ref={fileRef} onChange={onFileChange} style={{display: "none"}}/>
			<div className="gallery-list">
				{values.map((item, index) => (
					<button key={index} className={cn(selection.has(index) && "active")} onClick={() => select(index)}>
						<img src={item.src} alt="Фото услуги"/>
						<div className="check">
							<IoIosCheckmark/>
						</div>
					</button>
				))}
			</div>
		</div>
	)
}
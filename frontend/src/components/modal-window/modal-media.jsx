import React, { useRef } from 'react'
import cn from 'classnames'
import { Segment, Input, useForm, getControl } from 'controls'

import { IoIosCloudUpload } from 'react-icons/io'
import { modal, ModalBase } from './index'
import { getId, YoutubePreview } from 'libs/youtube'

const types = [
	"Изображение",
	"Видео с youtube"
]


export function ModalMedia({title, onSubmit, controls, defaultValues}){

	const form = useForm({type: 0, ...defaultValues})
	const fileRef = useRef()

	const onFileChange = (e) => {
		const file = e.target.files[0]
		if(!file) return
		e.target.value = ""

		const reader = new FileReader();				//Мы еще должны превратить наше изображение в массив и сразу отправить на сервер
		reader.onload = async () => {
			const array = reader.result;

			console.log(array)
			const headers = { 'Content-Type': file.type };

			const json = await fetch('/api/images', { method: 'POST', headers, body: array } )
			const resp = await json.json()

			if(resp.error) return

			form.onChange(resp)

		}

		reader.readAsArrayBuffer(file)

	}

	const _onSubmit = () => {
		const { type, src, url, youtube, ...values} = form.values.toObject()
		
		if(type === 0)
			onSubmit({ type, src, ...values })
		if(type === 1)
			onSubmit({ type, id: getId(url), ...values })
	}

	return (
		<ModalBase title={title} className="media">
			<Segment name="type" form={form} options={types}/>
			<input type="file" ref={fileRef} style={{display: "none"}} onChange={onFileChange}/>
			<div className="content">
				{controls && Object.keys(controls).map((key) => (
					<div key={key} className="control-container">
						{getControl(key, controls[key], form)}
					</div>
				))}
				{form.get("type") === 0 && (
					<div>
						{form.get("src")?(
							<img src={form.get('src')} alt="Загруженное изображение" className="preview-image"/>
						):(
						<button className="button-filled" onClick={() => fileRef.current.click()} style={{marginTop: "20px"}}>
							<IoIosCloudUpload/>Загрузить...
						</button>)}
					</div>
				)}

				{form.get("type") === 1 && (
					<div className="control-container">
						<Input form={form} name="url" label="Youtube URL" placeholder="Ссылка на ролик"/>
						{form.get('url') && getId(form.get('url')) && <YoutubePreview id={getId(form.get('url'))}/>}
					</div>
				)}
			</div>

			<div className="buttons">
				<button className="button" onClick={() => modal.close()}>Отмена</button>
				<button className={cn("button-filled")} onClick={_onSubmit}>Добавить</button>
			</div>
		</ModalBase>
	)
}

export function openModalMedia(title, controls, onSubmit, defaultValues){
	modal.open(<ModalMedia title={title} onSubmit={onSubmit} controls={controls} className="confirm" defaultValues={defaultValues}/>)
}
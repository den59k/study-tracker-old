import { useRef } from 'react'
import cn from 'classnames'
import { sendFile } from 'libs/upload'

import { IoCloudUploadOutline, IoDocument, IoCloseOutline } from 'react-icons/io5'

export default function FileControl ({label, form, name}){
	
	const fileRef = useRef()
	const values = form.get(name) || []

	const onFileChange = async (e) => {
		const file = e.target.files[0]
		if(!file) return
		e.target.value = ""

		const { src } = await sendFile(file, '/api/upload')
		form.onChange({ [name]: [...values, { name: file.name, src }] })
	}

	const deleteFile = (src) => {
		form.onChange({ [name]: values.filter(item => item.src !== src) })
	}

	return (
		<div className="file">
			<input type="file" style={{display: "none"}} onChange={onFileChange} ref={fileRef} name={name}/>
			{label && <label>{label}</label>}
			<div className="files-list">
				{values.map(item => (
					<div className="file-item" key={item.src}>
						<IoDocument/>{item.name}
						<button className="delete-button" title="Отменить отправку файла" onClick={() => deleteFile(item.src)}>
							<IoCloseOutline/>
						</button>
					</div>
				))}
				<button className="button-stroked" onClick={() => fileRef.current.click()}>
					<IoCloudUploadOutline/>{values.length === 0?'Загрузить файл': 'Добавить файл'}
				</button>
			</div>
		</div>
	)
}
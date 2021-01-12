import List from './index'
import { openModal, openModalConfirm } from 'components/modal-window'
import { GET, toREST } from 'libs/fetch'
import useSWR, { mutate } from 'swr'
import { useLocation } from 'components/router'
import { workTypes } from 'libs/constants'

import { IoMdCreate, IoMdTrash } from 'react-icons/io'
import { useMemo } from 'react'


const modalSubjects = {
	type: { type: "segment", options: workTypes, style: { fontSize: "0.95em" } },
	title: { type: "text", label: "Название работы", placeholder: "Работа по дисциплине" },
	theme: { type: "text", label: "Тема работы", placeholder: "Тема" },
	description: { type: "textarea", rows: 5, placeholder: "Краткое описание", checkNull: true }
}


const map = item => ({ ...item, sub: item.theme })

export default function LabsList (){

	const { get, push, replace } = useLocation()
	const subject = get(1)
	const selected = get(2)

	const url = '/api/subjects/'+subject+'/'

	const { data } = useSWR(url, GET)
	const mapData = useMemo(() => data? data.map(map): [], [ data ])

	modalSubjects.type.onChange = (type, form) => {
		const strType = workTypes[type]
		const count = data.reduce((acc, item) => item.type === type? acc+1: acc, 1)					//Ее, это подсчет значений

		if(type !== "other")
			form.onChange({ title: strType+" работа " + count })
		else
			form.onChange({ title: "" })
	}


	const addWork = () => {
		openModal("Добавление работы", modalSubjects, toREST(url), { type: "other" })
	}
	
	const editWork = (work) => {
		const mutateWork = (resp) => {
			if(work.url === selected)
				replace(resp.url, 2)
			mutate(url)
		}
		openModal("Редактирование работы", modalSubjects, toREST(url+work.url, 'PUT', mutateWork), work)
	}
	
	const deleteWork = (work) => {
		openModalConfirm("Удалить работу?", work.title, toREST(url+work.url, 'DELETE', url))
	}
	
	
	const menuItems = [
		{ title: "Редактировать работу", icon: <IoMdCreate/>, onClick: editWork },
		{ title: "Удалить работу", icon: <IoMdTrash/>, onClick: deleteWork }
	]
	
	const onSelectItem = (item) => {
		push(item.url, 2)
	}
	
	return (
		<List
			keyProp="url"
			onSelect={onSelectItem} 
			selected={selected}
			title="Работы" 
			items={mapData} 
			menuItems={menuItems} 
			onAdd={addWork}
		/>
	)
}